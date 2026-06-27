import { clonePreset } from '../domain/presets.js';
import { validatePattern } from '../domain/pattern-validator.js';
import { playPattern, stopPattern } from '../services/haptic-engine.js';
import { loadPattern, savePattern } from '../storage/pattern-storage.js';

const timeline = document.querySelector('#timeline');
const status = document.querySelector('#status');
const intensityInput = document.querySelector('#intensityInput');
const segmentType = document.querySelector('#segmentType');
const durationInput = document.querySelector('#durationInput');
const segmentIntensity = document.querySelector('#segmentIntensity');
const duplicateButton = document.querySelector('#duplicateButton');
const deleteButton = document.querySelector('#deleteButton');

let pattern = loadPattern(clonePreset('slow'));
let selectedIndex = 0;

function selectedSegment() {
  return pattern[selectedIndex] ?? null;
}

function commitPattern(message = 'Patrón guardado localmente') {
  savePattern(pattern);
  render();
  status.textContent = message;
}

function syncEditor() {
  const segment = selectedSegment();
  const disabled = !segment;
  [segmentType, durationInput, segmentIntensity, duplicateButton, deleteButton]
    .forEach((control) => { control.disabled = disabled; });

  if (!segment) return;
  segmentType.value = segment.type;
  durationInput.value = String(segment.durationMs);
  segmentIntensity.value = String(segment.intensity);
  segmentIntensity.disabled = segment.type === 'pause';
}

function render() {
  timeline.replaceChildren();
  pattern.forEach((segment, index) => {
    const bar = document.createElement('button');
    bar.type = 'button';
    bar.className = `segment ${segment.type}${index === selectedIndex ? ' selected' : ''}`;
    bar.style.height = `${Math.min(190, Math.max(40, segment.durationMs / 5))}px`;
    bar.textContent = `${segment.durationMs} ms`;
    bar.title = `Segmento ${index + 1}: ${segment.type}`;
    bar.setAttribute('aria-pressed', String(index === selectedIndex));
    bar.addEventListener('click', () => {
      selectedIndex = index;
      render();
    });
    timeline.appendChild(bar);
  });
  syncEditor();
}

function updateSelected(patch, message) {
  const segment = selectedSegment();
  if (!segment) return;
  pattern[selectedIndex] = { ...segment, ...patch };
  commitPattern(message);
}

function play() {
  const validation = validatePattern(pattern);
  if (!validation.ok) {
    status.textContent = validation.errors[0];
    return;
  }
  const result = playPattern(pattern);
  status.textContent = result.ok
    ? `Reproduciendo ${pattern.length} segmentos`
    : 'Este navegador no expone la Vibration API.';
}

function stop() {
  stopPattern();
  status.textContent = 'Detenido';
}

segmentType.addEventListener('change', () => {
  const type = segmentType.value;
  updateSelected({
    type,
    intensity: type === 'pause' ? 0 : Math.max(0.1, Number(segmentIntensity.value) || 0.6)
  }, 'Tipo actualizado');
});

durationInput.addEventListener('change', () => {
  const durationMs = Math.min(3000, Math.max(50, Number(durationInput.value) || 250));
  updateSelected({ durationMs }, 'Duración actualizada');
});

segmentIntensity.addEventListener('input', () => {
  if (selectedSegment()?.type !== 'vibrate') return;
  updateSelected({ intensity: Number(segmentIntensity.value) }, 'Intensidad actualizada');
});

duplicateButton.addEventListener('click', () => {
  const segment = selectedSegment();
  if (!segment) return;
  pattern.splice(selectedIndex + 1, 0, structuredClone(segment));
  selectedIndex += 1;
  commitPattern('Segmento duplicado');
});

deleteButton.addEventListener('click', () => {
  if (pattern.length <= 1) {
    status.textContent = 'El patrón debe conservar al menos un segmento.';
    return;
  }
  pattern.splice(selectedIndex, 1);
  selectedIndex = Math.min(selectedIndex, pattern.length - 1);
  commitPattern('Segmento eliminado');
});

document.querySelector('#addButton').addEventListener('click', () => {
  pattern.push({
    type: 'vibrate',
    durationMs: 250,
    intensity: Number(intensityInput.value),
    shape: 'pulse'
  });
  selectedIndex = pattern.length - 1;
  commitPattern('Segmento añadido y guardado');
});

document.querySelector('#slowPreset').addEventListener('click', () => {
  pattern = clonePreset('slow');
  selectedIndex = 0;
  commitPattern('Preset lento cargado');
});

document.querySelector('#fastPreset').addEventListener('click', () => {
  pattern = clonePreset('fast');
  selectedIndex = 0;
  commitPattern('Preset rápido cargado');
});

document.querySelector('#playButton').addEventListener('click', play);
document.querySelector('#stopButton').addEventListener('click', stop);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(() => {
    status.textContent = 'La aplicación funciona, pero el modo offline no pudo activarse.';
  });
}

render();