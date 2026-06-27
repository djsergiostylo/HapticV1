const STORAGE_KEY = 'haptic-v1.current-pattern';

export function loadPattern(fallbackPattern) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(fallbackPattern);

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : structuredClone(fallbackPattern);
  } catch {
    return structuredClone(fallbackPattern);
  }
}

export function savePattern(pattern) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pattern));
}

export function clearPattern() {
  localStorage.removeItem(STORAGE_KEY);
}
