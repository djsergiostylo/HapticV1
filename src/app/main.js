import { clonePreset } from '../domain/presets.js';
import { createPattern, normalizePattern } from '../domain/pattern-factory.js';
import { addSegment, duplicateSegment, moveSegment, removeSegment, scalePatternIntensity, updateSegment } from '../domain/pattern-operations.js';
import { validatePattern } from '../domain/pattern-validator.js';
import { playPattern, stopPattern } from '../services/haptic-engine.js';
import { bindGamepadEvents, getPrimaryGamepad, rumbleGamepad, stopGamepadRumble } from '../services/gamepad-driver.js';
import { getBluetoothStatus, requestBluetoothDevice } from '../services/bluetooth-driver.js';
import { analyzeAudioToSegments, decodeAudioFile } from '../services/audio-engine.js';
import { deletePattern, exportPattern, importPatternText, loadCurrentPattern, loadLibrary, saveCurrentPattern, upsertPattern } from '../storage/pattern-library.js';

const $ = selector => document.querySelector(selector);
const refs = {
  timeline: $('#timeline'), library: $('#library'), status: $('#status'), patternName: $('#patternName'),
  segmentType: $('#segmentType'), segmentShape: $('#segmentShape'), durationInput: $('#durationInput'),
  intensityInput: $('#intensityInput'), waveform: $('#waveform'), stats: $('#stats'), gamepadStatus: $('#gamepadStatus'),
  bluetoothStatus: $('#bluetoothStatus'), importBox: $('#importBox')
};

let pattern = loadCurrentPattern(createPattern('Patrón inicial', clonePreset('slow')));
let selectedId = pattern.segments[0]?.id ?? null;
let library = loadLibrary();
let playTimer = null;
let playCursor = 0;

function setStatus(message, mode = 'info') {
  refs.status.textContent = message;
  refs.status.dataset.mode = mode;
}

function persist(message = 'Cambios guardados') {
  saveCurrentPattern(pattern);
  library = upsertPattern(pattern);
  render();
  setStatus(message);
}

function render() {
  refs.patternName.value = pattern.name;
  renderTimeline();
  renderInspector();
  renderStats();
  renderLibrary();
  renderWaveform();
  renderDeviceStatus();
}

function renderTimeline() {
  refs.timeline.replaceChildren();
  pattern.segments.forEach((segment, index) => {
    const button = document.createElement('button');
    button.className = `segment-card ${segment.type} ${segment.id === selectedId ? 'selected' : ''}`;
    button.type = 'button';
    button.style.setProperty('--height', `${Math.max(44, segment.durationMs / 8)}px`);
    button.innerHTML = `<b>${index + 1}</b><span>${segment.durationMs} ms</span><small>${segment.shape}</small>`;
    button.addEventListener('click', () => { selectedId = segment.id; render(); });
    refs.timeline.appendChild(button);
  });
}

function renderInspector() {
  const selected = pattern.segments.find(segment => segment.id === selectedId) ?? pattern.segments[0];
  if (!selected) return;
  selectedId = selected.id;
  refs.segmentType.value = selected.type;
  refs.segmentShape.value = selected.shape;
  refs.durationInput.value = selected.durationMs;
  refs.intensityInput.value = selected.intensity;
}

function renderStats() {
  const total = pattern.segments.reduce((sum, segment) => sum + Number(segment.durationMs), 0);
  const active = pattern.segments.filter(segment => segment.type === 'vibrate').length;
  const validation = validatePattern(pattern.segments, pattern.settings);
  refs.stats.innerHTML = `
    <div><b>${pattern.segments.length}</b><span>segmentos</span></div>
    <div><b>${(total / 1000).toFixed(1)} s</b><span>duración</span></div>
    <div><b>${active}</b><span>activos</span></div>
    <div><b>${validation.ok ? 'OK' : 'REV'}</b><span>validación</span></div>`;
  if (!validation.ok) setStatus(validation.errors[0], 'warn');
}

function renderLibrary() {
  refs.library.replaceChildren();
  library.forEach(item => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'library-item';
    row.innerHTML = `<b>${item.name}</b><span>${item.segments?.length ?? 0} segmentos · v${item.version ?? 1}</span>`;
    row.addEventListener('click', () => { pattern = normalizePattern(item); selectedId = pattern.segments[0]?.id; persist('Patrón cargado'); });
    refs.library.appendChild(row);
  });
}

function renderWaveform() {
  const canvas = refs.waveform;
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.clientWidth * devicePixelRatio;
  const height = canvas.height = canvas.clientHeight * devicePixelRatio;
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 2 * devicePixelRatio;
  ctx.beginPath();
  pattern.segments.forEach((segment, index) => {
    const x = (index / Math.max(1, pattern.segments.length - 1)) * width;
    const amp = segment.type === 'vibrate' ? segment.intensity : 0.08;
    const y = height - amp * height * 0.86;
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#ff4f64';
  ctx.stroke();
}

function renderDeviceStatus() {
  const gamepad = getPrimaryGamepad();
  refs.gamepadStatus.textContent = gamepad ? `${gamepad.id}` : 'Sin mando detectado';
  const bt = getBluetoothStatus();
  refs.bluetoothStatus.textContent = bt.supported ? (bt.secureContext ? 'Disponible' : 'Requiere HTTPS/local seguro') : 'No compatible';
}

async function playLocalAndGamepad() {
  clearTimeout(playTimer);
  stopPattern();
  await stopGamepadRumble();
  const validation = validatePattern(pattern.segments, pattern.settings);
  if (!validation.ok) return setStatus(validation.errors[0], 'warn');
  playPattern(pattern.segments);
  playCursor = 0;
  runGamepadQueue();
  setStatus('Reproduciendo patrón en móvil/navegador y mando si está disponible');
}

async function runGamepadQueue() {
  const segment = pattern.segments[playCursor];
  if (!segment) return;
  if (segment.type === 'vibrate') await rumbleGamepad(segment);
  playTimer = setTimeout(() => { playCursor += 1; runGamepadQueue(); }, segment.durationMs);
}

async function stopAll() {
  clearTimeout(playTimer);
  stopPattern();
  await stopGamepadRumble();
  setStatus('Todo detenido');
}

function updateSelected(patch) {
  pattern = updateSegment(pattern, selectedId, patch);
  persist('Segmento actualizado');
}

$('#newPattern').addEventListener('click', () => { pattern = createPattern('Nuevo patrón'); selectedId = pattern.segments[0].id; persist('Nuevo patrón creado'); });
$('#savePattern').addEventListener('click', () => persist('Patrón guardado en biblioteca local'));
$('#addSegment').addEventListener('click', () => { pattern = addSegment(pattern, { intensity: Number(refs.intensityInput.value) }); selectedId = pattern.segments.at(-1).id; persist('Segmento añadido'); });
$('#duplicateSegment').addEventListener('click', () => { pattern = duplicateSegment(pattern, selectedId); persist('Segmento duplicado'); });
$('#removeSegment').addEventListener('click', () => { pattern = removeSegment(pattern, selectedId); selectedId = pattern.segments[0]?.id; persist('Segmento eliminado'); });
$('#moveLeft').addEventListener('click', () => { pattern = moveSegment(pattern, selectedId, -1); persist('Segmento movido'); });
$('#moveRight').addEventListener('click', () => { pattern = moveSegment(pattern, selectedId, 1); persist('Segmento movido'); });
$('#playPattern').addEventListener('click', playLocalAndGamepad);
$('#stopButton').addEventListener('click', stopAll);
$('#slowPreset').addEventListener('click', () => { pattern = createPattern('Preset lento', clonePreset('slow')); selectedId = pattern.segments[0].id; persist('Preset lento cargado'); });
$('#fastPreset').addEventListener('click', () => { pattern = createPattern('Preset rápido', clonePreset('fast')); selectedId = pattern.segments[0].id; persist('Preset rápido cargado'); });
$('#deleteCurrent').addEventListener('click', () => { library = deletePattern(pattern.id); pattern = createPattern('Nuevo patrón'); selectedId = pattern.segments[0].id; persist('Patrón borrado'); });
$('#exportPattern').addEventListener('click', () => { refs.importBox.value = exportPattern(pattern); setStatus('JSON exportado al cuadro inferior'); });
$('#importPattern').addEventListener('click', () => { pattern = normalizePattern(importPatternText(refs.importBox.value)); selectedId = pattern.segments[0]?.id; persist('Patrón importado'); });
$('#connectBluetooth').addEventListener('click', async () => { const res = await requestBluetoothDevice(); setStatus(res.ok ? `Bluetooth enlazado: ${res.deviceName}` : `Bluetooth: ${res.reason}`, res.ok ? 'info' : 'warn'); renderDeviceStatus(); });
$('#audioFile').addEventListener('change', async event => { const file = event.target.files?.[0]; if (!file) return; setStatus('Analizando audio local...'); const buffer = await decodeAudioFile(file); pattern = createPattern(file.name, analyzeAudioToSegments(buffer)); pattern.source = 'audio'; selectedId = pattern.segments[0]?.id; persist('Audio convertido en patrón editable'); });
refs.patternName.addEventListener('change', () => { pattern = { ...pattern, name: refs.patternName.value, updatedAt: new Date().toISOString() }; persist('Nombre actualizado'); });
refs.segmentType.addEventListener('change', () => updateSelected({ type: refs.segmentType.value, intensity: refs.segmentType.value === 'pause' ? 0 : Number(refs.intensityInput.value) }));
refs.segmentShape.addEventListener('change', () => updateSelected({ shape: refs.segmentShape.value }));
refs.durationInput.addEventListener('change', () => updateSelected({ durationMs: Number(refs.durationInput.value) }));
refs.intensityInput.addEventListener('input', () => updateSelected({ intensity: refs.segmentType.value === 'pause' ? 0 : Number(refs.intensityInput.value) }));
$('#globalIntensity').addEventListener('input', event => { pattern = scalePatternIntensity(pattern, event.target.value); persist('Intensidad global aplicada'); });

document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
bindGamepadEvents(() => renderDeviceStatus());
setInterval(renderDeviceStatus, 1500);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(() => setStatus('Offline no disponible', 'warn'));

persist('App profesional cargada');
