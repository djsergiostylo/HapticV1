const LIBRARY_KEY = 'haptic-v1.pattern-library';
const CURRENT_KEY = 'haptic-v1.current-pattern-v3';

export function loadLibrary() {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLibrary(items) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(items));
}

export function upsertPattern(pattern) {
  const library = loadLibrary();
  const index = library.findIndex(item => item.id === pattern.id);
  const next = index >= 0 ? library.with(index, pattern) : [pattern, ...library];
  saveLibrary(next);
  saveCurrentPattern(pattern);
  return next;
}

export function deletePattern(patternId) {
  const next = loadLibrary().filter(item => item.id !== patternId);
  saveLibrary(next);
  return next;
}

export function loadCurrentPattern(fallback) {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveCurrentPattern(pattern) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(pattern));
}

export function exportPattern(pattern) {
  return JSON.stringify(pattern, null, 2);
}

export function importPatternText(text) {
  return JSON.parse(text);
}
