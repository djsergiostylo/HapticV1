import { loadPattern, savePattern } from '../storage/pattern-storage.js';

const timeline = document.querySelector('#timeline');
const status = document.querySelector('#status');
const intensityInput = document.querySelector('#intensityInput');

const presets = {
  slow: [
    { type: 'vibrate', durationMs: 800, intensity: 0.5, shape: 'sustain' },
    { type: 'pause', durationMs: 350, intensity: 0, shape: 'sustain' },
    { type: 'vibrate', durationMs: 1200, intensity: 0.7, shape: 'ramp-up' }
  ],
  fast: [
    { type: 'vibrate', durationMs: 180, intensity: 0.8, shape: 'pulse' },
    { type: 'pause', durationMs: 100, intensity: 0, shape: 'pulse' },
    { type: 'vibrate', durationMs: 180, intensity: 1, shape: 'pulse' },
    { type: 'pause', durationMs: 100, intensity: 0, shape: 'pulse' },
    { type: 'vibrate', durationMs: 300, intensity: 0.9, shape: 'burst' }
  ]
};

let pattern = loadPattern(presets.slow);

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

function toVibrationSequence(segments) {
  return segments.map(segment => segment.type === 'vibrate' ? segment.durationMs : 0);
}

function play() {
  if (!('vibrate' in navigator)) {
    status.textContent = 'Este navegador no expone la Vibration API.';
    return;
  }

  navigator.vibrate(0);
  navigator.vibrate(toVibrationSequence(pattern));
  status.textContent = `Reproduciendo ${pattern.length} segmentos`;
}

function stop() {
  navigator.vibrate?.(0);
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
  pattern = structuredClone(presets.slow);
  commitPattern('Preset lento cargado');
});

document.querySelector('#fastPreset').addEventListener('click', () => {
  pattern = structuredClone(presets.fast);
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
