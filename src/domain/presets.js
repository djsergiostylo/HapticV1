export const PRESETS = Object.freeze({
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
});

export function clonePreset(name) {
  const preset = PRESETS[name];
  if (!preset) throw new Error(`Preset no encontrado: ${name}`);
  return structuredClone(preset);
}
