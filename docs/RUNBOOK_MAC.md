# Guía de funcionamiento en MacBook Pro

## Objetivo

Ejecutar HapticV1 como PWA local/progresiva para probar edición de patrones, vibración web, audio local, Gamepad API y detección Web Bluetooth.

## Requisitos

- MacBook Pro.
- Google Chrome o Microsoft Edge actualizado.
- Repositorio clonado o descargado.
- Mando Xbox One emparejado por Bluetooth o USB.
- Para PWA completa: contexto seguro. `localhost` es válido para desarrollo.

## Arranque local

```bash
git clone https://github.com/djsergiostylo/HapticV1.git
cd HapticV1
python3 -m http.server 5173
```

Abrir:

```text
http://localhost:5173
```

## Pruebas mínimas

1. Crear un patrón nuevo.
2. Añadir segmentos.
3. Editar duración, tipo, forma e intensidad.
4. Guardar en biblioteca local.
5. Exportar JSON.
6. Importar JSON.
7. Cargar audio local y convertirlo en patrón.
8. Conectar mando Xbox y pulsar un botón para que el navegador lo detecte.
9. Probar reproducción.
10. Probar parada inmediata.

## Limitaciones reales

- La vibración del móvil mediante `navigator.vibrate()` depende del navegador y hardware.
- La vibración del mando depende de soporte `GamepadHapticActuator` o `vibrationActuator`.
- Web Bluetooth sirve para BLE genérico, no garantiza controlar vibración de mandos Xbox.
- En Mac, el soporte de vibración de gamepad puede variar por navegador, conexión y driver.

## Criterio de listo para demo

- La UI carga sin errores en consola.
- El patrón se guarda tras recargar.
- La biblioteca muestra patrones guardados.
- El audio genera segmentos.
- El botón DETENER TODO corta navegador y mando si están disponibles.
