import { clonePreset } from './presets.js';

export function createSegment(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    type: overrides.type ?? 'vibrate',
    durationMs: Number(overrides.durationMs ?? 300),
    intensity: Number(overrides.intensity ?? 0.6),
    shape: overrides.shape ?? 'pulse'
  };
}

export function createPattern(name = 'Nuevo patrón', segments = clonePreset('slow')) {
  return {
    id: crypto.randomUUID(),
    name,
    version: 1,
    source: 'manual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    segments: segments.map(segment => createSegment(segment)),
    settings: {
      loop: false,
      globalIntensity: 0.6,
      maxContinuousMs: 3000
    }
  };
}

export function normalizePattern(input, fallbackName = 'Patrón importado') {
  if (Array.isArray(input)) return createPattern(fallbackName, input);

  return {
    ...createPattern(input?.name ?? fallbackName, input?.segments ?? clonePreset('slow')),
    ...input,
    segments: (input?.segments ?? clonePreset('slow')).map(segment => createSegment(segment)),
    updatedAt: new Date().toISOString()
  };
}

export function touchPattern(pattern) {
  return {
    ...pattern,
    version: Number(pattern.version ?? 1) + 1,
    updatedAt: new Date().toISOString()
  };
}
