import { createSegment, touchPattern } from './pattern-factory.js';

export function addSegment(pattern, segment = {}) {
  return touchPattern({ ...pattern, segments: [...pattern.segments, createSegment(segment)] });
}

export function updateSegment(pattern, segmentId, patch) {
  return touchPattern({
    ...pattern,
    segments: pattern.segments.map(segment => (
      segment.id === segmentId ? { ...segment, ...patch } : segment
    ))
  });
}

export function duplicateSegment(pattern, segmentId) {
  const source = pattern.segments.find(segment => segment.id === segmentId);
  if (!source) return pattern;
  const index = pattern.segments.findIndex(segment => segment.id === segmentId);
  const next = [...pattern.segments];
  next.splice(index + 1, 0, createSegment(source));
  return touchPattern({ ...pattern, segments: next });
}

export function removeSegment(pattern, segmentId) {
  if (pattern.segments.length <= 1) return pattern;
  return touchPattern({ ...pattern, segments: pattern.segments.filter(segment => segment.id !== segmentId) });
}

export function moveSegment(pattern, segmentId, direction) {
  const index = pattern.segments.findIndex(segment => segment.id === segmentId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= pattern.segments.length) return pattern;
  const next = [...pattern.segments];
  [next[index], next[target]] = [next[target], next[index]];
  return touchPattern({ ...pattern, segments: next });
}

export function scalePatternIntensity(pattern, value) {
  const intensity = Number(value);
  return touchPattern({
    ...pattern,
    settings: { ...pattern.settings, globalIntensity: intensity },
    segments: pattern.segments.map(segment => segment.type === 'vibrate'
      ? { ...segment, intensity }
      : { ...segment, intensity: 0 })
  });
}
