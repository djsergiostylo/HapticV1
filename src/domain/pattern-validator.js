const VALID_TYPES = new Set(['vibrate', 'pause']);
const VALID_SHAPES = new Set(['pulse', 'sustain', 'burst', 'ramp-up', 'ramp-down']);

export function validatePattern(pattern, options = {}) {
  const maxContinuousMs = Number(options.maxContinuousMs ?? 3000);
  const errors = [];

  if (!Array.isArray(pattern) || pattern.length === 0) {
    return { ok: false, errors: ['El patrón debe contener al menos un segmento.'] };
  }

  let continuousVibrationMs = 0;

  pattern.forEach((segment, index) => {
    const label = `Segmento ${index + 1}`;
    const durationMs = Number(segment?.durationMs);
    const intensity = Number(segment?.intensity);

    if (!VALID_TYPES.has(segment?.type)) {
      errors.push(`${label}: tipo no válido.`);
    }

    if (!Number.isFinite(durationMs) || durationMs <= 0) {
      errors.push(`${label}: duración inválida.`);
    }

    if (!Number.isFinite(intensity) || intensity < 0 || intensity > 1) {
      errors.push(`${label}: intensidad fuera de rango.`);
    }

    if (!VALID_SHAPES.has(segment?.shape)) {
      errors.push(`${label}: forma no válida.`);
    }

    if (segment?.type === 'pause' && intensity !== 0) {
      errors.push(`${label}: una pausa debe tener intensidad 0.`);
    }

    if (segment?.type === 'vibrate') {
      continuousVibrationMs += Math.max(0, durationMs || 0);
      if (continuousVibrationMs > maxContinuousMs) {
        errors.push(`${label}: supera el límite continuo de ${maxContinuousMs} ms.`);
      }
    } else {
      continuousVibrationMs = 0;
    }
  });

  return { ok: errors.length === 0, errors };
}
