# HapticV1

Editor visual profesional de patrones hápticos con sincronización musical para Android/PWA.

## Estado actual

Prototipo funcional inicial con:

- timeline visual de segmentos;
- presets lento y rápido;
- reproducción mediante Vibration API;
- parada inmediata;
- persistencia local del patrón;
- manifiesto PWA;
- service worker y caché offline básica;
- documentación de arquitectura, modelo de datos y roadmap.

## Estructura

```text
HapticV1/
├── index.html
├── service-worker.js
├── public/
│   └── manifest.webmanifest
├── src/
│   ├── app/
│   │   └── bootstrap.js
│   ├── storage/
│   │   └── pattern-storage.js
│   └── styles/
│       └── app.css
└── docs/
    ├── ARCHITECTURE.md
    ├── DATA_MODEL.md
    └── ROADMAP.md
```

## Ejecución local

La aplicación debe servirse mediante HTTP o HTTPS para que los módulos JavaScript y el service worker funcionen correctamente.

Ejemplo con Python:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080`.

## Compatibilidad prevista

Objetivo principal: Chrome para Android, con validación específica en Xiaomi Redmi Note 9 Pro. La intensidad real del motor no puede controlarse desde la Vibration API; la aplicación simula variaciones mediante duración, pausas y densidad de pulsos.

## Próxima fase

1. Separar dominio, motor háptico y componentes visuales.
2. Añadir edición de duración, duplicado y eliminación de segmentos.
3. Incorporar importación y exportación JSON.
4. Añadir Web Audio API y sincronización musical.
5. Probar instalación y comportamiento en Android/MIUI.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Modelo de datos](docs/DATA_MODEL.md)
- [Roadmap](docs/ROADMAP.md)
