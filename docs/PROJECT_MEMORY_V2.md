# HapticV1 — Memoria operativa

> Registro principal, breve y cronológico. Añadir siempre al final. No borrar ni reordenar entradas previas.

## Reglas

- Formato: `AAAA-MM-DD · HH:MM`.
- Solo hechos, decisiones, cambios y bloqueos.
- Máx. 5 líneas por entrada.
- Usar rutas, commits o enlaces cuando aporten valor.
- Si cambia una decisión, registrar la nueva sin editar la antigua.

## Estado base

- Repo: `djsergiostylo/HapticV1`.
- Meta: PWA Android para patrones hápticos + música.
- Dispositivo objetivo inicial: Xiaomi Redmi Note 9 Pro.
- Prioridad: terminar GitHub antes de pasar a Google Drive.

## Estructura actual

- UI: `index.html`.
- Lógica inicial: `src/app/bootstrap.js`.
- Estilos: `src/styles/app.css`.
- Docs: `ARCHITECTURE.md`, `DATA_MODEL.md`, `ROADMAP.md`.

## Pendientes clave

- PWA real: manifest, service worker e iconos.
- Editor: editar, mover, duplicar y borrar segmentos.
- Audio: Web Audio API y sincronización.
- Datos: guardado local, importación y exportación.
- Backend: definir solo tras estabilizar el MVP local.

## Registro

### 2026-06-27 · Inicio

- Creado `PROJECT_MEMORY_V2.md` como memoria principal optimizada.
- `PROJECT_MEMORY.md` se conserva como histórico original.
- Desde ahora, cada avance se añadirá aquí en cadena cronológica.

### 2026-06-27 · Modularización MVP

- Activado `src/app/bootstrap-v2.js` desde `index.html`.
- Separados presets en `src/domain/presets.js`.
- Separado motor háptico en `src/services/haptic-engine.js`.
- PWA confirmada con manifest y Service Worker v3.
- Añadido `src/domain/pattern-validator.js` con límites y reglas básicas.

### 2026-06-27 · Editor de segmentos MVP

- Añadida selección visual de barras y panel de edición.
- Editables: tipo, duración e intensidad; duplicar y eliminar.
- Validación aplicada antes de reproducir; guardado local automático.
- Service Worker actualizado a caché v4 e incluye el validador.
- Siguiente: reordenación, importación/exportación y forma de onda.

### 2026-07-12 · Versión profesional web

- Activada UI profesional con `src/app/main.js` y `src/styles/pro.css`.
- Añadidos módulos: fábrica, operaciones, biblioteca, audio, Bluetooth y Gamepad/Xbox.
- Funciones activas: editor, biblioteca local, import/export, audio a patrón, PWA offline y parada total.
- Documentación añadida: Mac runbook, guía de código, compatibilidad y comercialización.
- Limitación registrada: Bluetooth no garantiza controlar vibración Xbox; se prioriza Gamepad API.
