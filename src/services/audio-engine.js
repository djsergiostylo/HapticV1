export async function decodeAudioFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const context = new AudioContext();
  const audioBuffer = await context.decodeAudioData(arrayBuffer);
  await context.close();
  return audioBuffer;
}

export function analyzeAudioToSegments(audioBuffer, options = {}) {
  const channel = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const windowMs = Number(options.windowMs ?? 160);
  const threshold = Number(options.threshold ?? 0.18);
  const step = Math.max(1, Math.floor(sampleRate * (windowMs / 1000)));
  const segments = [];

  for (let offset = 0; offset < channel.length; offset += step) {
    let sum = 0;
    const end = Math.min(offset + step, channel.length);
    for (let i = offset; i < end; i += 1) sum += Math.abs(channel[i]);
    const energy = sum / Math.max(1, end - offset);
    const active = energy >= threshold;
    segments.push({
      type: active ? 'vibrate' : 'pause',
      durationMs: windowMs,
      intensity: active ? Math.min(1, Math.max(0.2, energy * 4)) : 0,
      shape: active ? 'pulse' : 'sustain'
    });
  }

  return compactSegments(segments).slice(0, 96);
}

function compactSegments(segments) {
  return segments.reduce((acc, segment) => {
    const previous = acc.at(-1);
    if (previous && previous.type === segment.type && Math.abs(previous.intensity - segment.intensity) < 0.12) {
      previous.durationMs += segment.durationMs;
      previous.intensity = Number(((previous.intensity + segment.intensity) / 2).toFixed(2));
      return acc;
    }
    acc.push({ ...segment, intensity: Number(segment.intensity.toFixed(2)) });
    return acc;
  }, []);
}
