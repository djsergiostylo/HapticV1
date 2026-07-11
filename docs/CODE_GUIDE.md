# Guía de código — HapticV1

## Principio

Separar interfaz, dominio, servicios de dispositivo y almacenamiento. Ningún componente visual debe conocer detalles de Bluetooth, Gamepad, localStorage o backend futuro.

## Capas

```text
src/app/          Orquestación de UI y estado
src/domain/       Modelo, presets, validación y operaciones puras
src/services/     APIs del navegador: vibración, audio, gamepad, bluetooth
src/storage/      Persistencia local e import/export
src/styles/       Sistema visual
```

## Archivos principales

- `src/app/main.js`: controlador principal de la PWA.
- `src/domain/pattern-factory.js`: crea patrones y segmentos normalizados.
- `src/domain/pattern-operations.js`: edición: añadir, duplicar, mover, borrar, escalar intensidad.
- `src/domain/pattern-validator.js`: reglas de seguridad y consistencia.
- `src/services/haptic-engine.js`: vibración del navegador.
- `src/services/gamepad-driver.js`: mando Xbox/Gamepad API.
- `src/services/bluetooth-driver.js`: detección y solicitud Web Bluetooth.
- `src/services/audio-engine.js`: convierte audio local en segmentos.
- `src/storage/pattern-library.js`: biblioteca local, import/export JSON.

## Regla de evolución

1. Si es lógica de negocio, va en `domain`.
2. Si toca APIs del navegador, va en `services`.
3. Si guarda o carga datos, va en `storage`.
4. Si solo pinta o escucha botones, va en `app` o futuros `components`.

## Backend futuro

Cuando se añada servidor, implementar primero una interfaz de repositorio remoto compatible con `pattern-library.js`. La UI no debe cambiar de forma profunda.

## Próximas mejoras técnicas

- Extraer renderizado de timeline a `components/timeline-view.js`.
- Añadir tests unitarios para `pattern-operations.js`.
- Sustituir localStorage por IndexedDB cuando haya muchos patrones.
- Añadir exportación de pack `.json` por biblioteca completa.
- Crear CI con validación básica de HTML/JS.
