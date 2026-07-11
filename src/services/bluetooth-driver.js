export function getBluetoothStatus() {
  return {
    supported: typeof navigator !== 'undefined' && 'bluetooth' in navigator,
    secureContext: globalThis.isSecureContext === true
  };
}

export async function requestBluetoothDevice() {
  const status = getBluetoothStatus();
  if (!status.supported) return { ok: false, reason: 'unsupported' };
  if (!status.secureContext) return { ok: false, reason: 'insecure-context' };

  try {
    const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: [] });
    return { ok: true, deviceName: device.name || 'Dispositivo Bluetooth' };
  } catch (error) {
    return { ok: false, reason: error.name || 'bluetooth-error' };
  }
}
