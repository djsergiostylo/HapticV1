# Compatibilidad de dispositivos

## Navegador / móvil

La vibración web usa `navigator.vibrate()`. Permite secuencias de duración y pausa, pero no control fino real de potencia física. La potencia depende del dispositivo.

## Mando Xbox One

La vía correcta en navegador es Gamepad API:

- `navigator.getGamepads()` para detectar mandos.
- `gamepad.vibrationActuator` o `gamepad.hapticActuators` para vibración si el navegador lo soporta.
- `playEffect('dual-rumble')` cuando esté disponible.

La app implementa compatibilidad progresiva. Si el mando no expone actuador háptico, se detectará como mando sin vibración utilizable.

## Bluetooth

Web Bluetooth sirve para periféricos BLE que exponen servicios GATT. No debe asumirse que un mando Xbox permita control de vibración vía Web Bluetooth. Para mandos, priorizar Gamepad API.

## MacBook Pro

Chrome/Edge en `localhost` es el entorno recomendado para desarrollo. Safari puede tener limitaciones mayores con APIs experimentales.

## Android / Xiaomi Redmi Note 9 Pro

Chrome Android es el objetivo inicial. Probar:

- vibración con pantalla activa;
- comportamiento al bloquear pantalla;
- ahorro de batería MIUI;
- instalación PWA;
- persistencia local;
- carga de audio local.
