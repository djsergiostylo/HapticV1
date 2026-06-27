export function isHapticsSupported() {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

export function buildVibrationSequence(segments) {
  return segments.map(segment => (
    segment.type === 'vibrate' ? Math.max(0, Number(segment.durationMs) || 0) : 0
  ));
}

export function playPattern(segments) {
  if (!isHapticsSupported()) {
    return { ok: false, reason: 'unsupported' };
  }

  navigator.vibrate(0);
  navigator.vibrate(buildVibrationSequence(segments));
  return { ok: true };
}

export function stopPattern() {
  if (isHapticsSupported()) navigator.vibrate(0);
}
