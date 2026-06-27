# Roadmap de construcción

## Fase 0 — Base técnica

- Definir arquitectura.
- Definir modelo de datos.
- Crear estructura de carpetas.
- Configurar PWA mínima.
- Documentar límites técnicos de Android.

## Fase 1 — Editor local MVP

- Crear timeline horizontal.
- Añadir, editar, mover, duplicar y borrar segmentos.
- Tipos iniciales: vibración, pausa, pulso, onda y ráfaga.
- Previsualización visual.
- Reproducción mediante Vibration API.
- Parada inmediata.
- Guardado local.

## Fase 2 — Audio y sincronización

- Carga de archivo local.
- Visualización de forma de onda.
- Análisis básico de energía y transitorios.
- Sensibilidad de bajos, medios y agudos.
- Conversión automática a patrón editable.
- Grabación manual de ritmo.

## Fase 3 — PWA instalable

- Manifest.
- Service Worker.
- Funcionamiento offline.
- Iconos y pantalla de instalación.
- Pruebas específicas en Xiaomi Redmi Note 9 Pro.

## Fase 4 — Backend opcional

- API versionada.
- Autenticación.
- Sincronización entre dispositivos.
- Biblioteca privada y pública.
- Historial de versiones.
- Métricas con consentimiento.

## Fase 5 — Producto

- Perfiles y planes.
- Exportación e importación.
- Compartición mediante enlaces.
- Moderación de contenido público.
- Cobros y suscripciones.

## Criterio de avance

Una fase solo se considera terminada cuando:

1. funciona en Android real;
2. tiene manejo de errores;
3. dispone de pruebas mínimas;
4. está documentada;
5. no rompe los contratos de datos definidos.
