import { clonePreset } from '../domain/presets.js';
import { playPattern, stopPattern } from '../services/haptic-engine.js';
import { loadPattern, savePattern } from '../storage/pattern-storage.js';

const timeline = document.querySelector('#timeline');
const status = document.querySelector('#status');
const intensityInput = document.querySelector('#intensityInput');

let pattern = loadPattern(clonePreset('slow'));

function commitPattern(message = 'Patrón guardado localmente') {
  savePattern(pattern);
  render();
  status.textContent = message;
}

function render() {
  timeline.replaceChildren();

  pattern.forEach((segment, index) => {
    const bar = document.createElement('button');
    bar.type = 'button';
    bar.className = `segment ${segment.type}`;
    bar.style.height = `${Math.max(40, segment.durationMs / 5)}px`;
    bar.textContent = `${segment.durationMs} ms`;
    bar.title = `Segmento ${index + 1}: ${segment.type}`;
    bar.addEventListener('click', () => toggleSegment(index));
    timeline.appendChild(bar);
  });
}

function toggleSegment(index) {
  const current = pattern[index];
  pattern[index] = current.type === 'vibrate'
    ? { ...current, type: 'pause', intensity: 0 }
    : { ...current, type: 'vibrate', intensity: Number(intensityInput.value) };
  commitPattern();
}

function play() {
  const result = playPattern(pattern);
  status.textContent = result.ok
    ? `Reproduciendo ${pattern.length} segmentos`
    : 'Este navegador no expone la Vibration API.';
}

function stop() {
  stopPattern();
  status.textContent = 'Detenido';
}

document.querySelector('#addButton').addEventListener('click', () => {
  pattern.push({
    type: 'vibrate',
    durationMs: 250,
    intensity: Number(intensityInput.value),
    shape: 'pulse'
  });
  commitPattern('Segmento añadido y guardado');
});

document.querySelector('#slowPreset').addEventListener('click', () => {
  pattern = clonePreset('slow');
  commitPattern('Preset lento cargado');
});

document.querySelector('#fastPreset').addEventListener('click', () => {
  pattern = clonePreset('fast');
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
