let activeGamepadIndex = null;

export function getGamepads() {
  return Array.from(navigator.getGamepads?.() ?? []).filter(Boolean);
}

export function getPrimaryGamepad() {
  const pads = getGamepads();
  if (activeGamepadIndex !== null) {
    return pads.find(pad => pad.index === activeGamepadIndex) ?? pads[0] ?? null;
  }
  return pads[0] ?? null;
}

export function bindGamepadEvents(onChange) {
  window.addEventListener('gamepadconnected', event => {
    activeGamepadIndex = event.gamepad.index;
    onChange?.(event.gamepad);
  });
  window.addEventListener('gamepaddisconnected', () => {
    activeGamepadIndex = null;
    onChange?.(null);
  });
}

export async function rumbleGamepad(segment) {
  const gamepad = getPrimaryGamepad();
  if (!gamepad) return { ok: false, reason: 'no-gamepad' };

  const duration = Math.max(1, Number(segment.durationMs) || 1);
  const intensity = Math.max(0, Math.min(1, Number(segment.intensity) || 0));
  const actuator = gamepad.vibrationActuator ?? gamepad.hapticActuators?.[0];

  if (!actuator) return { ok: false, reason: 'no-actuator' };

  if (typeof actuator.playEffect === 'function') {
    await actuator.playEffect('dual-rumble', {
      startDelay: 0,
      duration,
      weakMagnitude: intensity * 0.65,
      strongMagnitude: intensity
    });
    return { ok: true };
  }

  if (typeof actuator.pulse === 'function') {
    await actuator.pulse(intensity, duration);
    return { ok: true };
  }

  return { ok: false, reason: 'unsupported-actuator' };
}

export async function stopGamepadRumble() {
  const gamepad = getPrimaryGamepad();
  const actuator = gamepad?.vibrationActuator ?? gamepad?.hapticActuators?.[0];
  if (typeof actuator?.reset === 'function') await actuator.reset();
}
