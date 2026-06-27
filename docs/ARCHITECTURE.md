# Arquitectura técnica de HapticV1

## 1. Principio general

La aplicación se construirá como una PWA modular. El frontend gestionará la interacción visual y las APIs del dispositivo. El backend se reservará para funciones que realmente necesiten servidor: cuentas, sincronización entre dispositivos, biblioteca compartida, métricas y futuras suscripciones.

El MVP debe funcionar localmente sin backend obligatorio.

## 2. Capas

### Presentación

Responsable de:

- Timeline de barras.
- Editor de segmentos.
- Visualizador de onda.
- Controles de reproducción.
- Presets y biblioteca.
- Estado visible de seguridad y compatibilidad.

### Dominio

Responsable de:

- Modelo de patrón.
- Validación de segmentos.
- Transformación de intensidad simulada.
- Generación aleatoria.
- Conversión de audio a eventos hápticos.
- Límites de seguridad.

### Servicios del dispositivo

Responsable de:

- Vibration API.
- Web Audio API.
- lectura de archivos locales.
- temporización de reproducción.
- instalación PWA y funcionamiento offline.

### Persistencia local

Responsable de:

- Preferencias.
- Presets.
- patrones guardados.
- borradores de edición.

La primera versión usará localStorage. IndexedDB quedará preparada para patrones, audio analizado y bibliotecas mayores.

### Backend futuro

Responsable de:

- Autenticación.
- Sincronización de patrones.
- API de biblioteca.
- control de versiones de patrones.
- analítica consentida.
- planes y suscripciones.

El frontend consumirá el backend mediante una interfaz `PatternRepository`, permitiendo alternar entre almacenamiento local y remoto sin rehacer el editor.

## 3. Flujo principal

1. El usuario crea, importa o genera un patrón.
2. El editor lo transforma a un modelo normalizado.
3. El motor de seguridad valida duración y continuidad.
4. El motor háptico traduce el patrón a pulsos compatibles con `navigator.vibrate()`.
5. El visualizador refleja el estado en tiempo real.
6. El repositorio guarda el patrón localmente o, en una fase posterior, en el backend.

## 4. Restricciones Android/PWA

- La intensidad física del motor no puede controlarse de forma fiable desde la web.
- La intensidad se simulará mediante duración, densidad y separación de pulsos.
- La reproducción puede verse afectada por ahorro de batería, bloqueo de pantalla o políticas del navegador.
- El audio debe iniciarse tras una interacción del usuario.
- Se probará prioritariamente en Chrome para Android y Xiaomi Redmi Note 9 Pro.

## 5. Seguridad funcional

- Botón de parada inmediata siempre visible.
- Límite configurable de vibración continua.
- Pausa obligatoria entre bloques prolongados.
- Validación antes de reproducir.
- Cancelación al ocultar la aplicación cuando sea necesario.
- No se enviará audio local al servidor en el MVP.

## 6. Estructura prevista

```text
public/
  manifest.webmanifest
  icons/
src/
  app/
    bootstrap.js
    state.js
  components/
    timeline.js
    waveform.js
    transport.js
    preset-panel.js
  domain/
    pattern.js
    segment.js
    validators.js
    random-generator.js
  services/
    audio-engine.js
    haptic-engine.js
    sync-engine.js
    safety-engine.js
  storage/
    local-pattern-repository.js
    remote-pattern-repository.js
  styles/
    tokens.css
    app.css
  utils/
    time.js
    ids.js
index.html
service-worker.js
```

## 7. Correlación frontend-backend

El frontend no conocerá detalles de base de datos ni proveedores. Trabajará contra contratos estables:

- `PatternRepository.list()`
- `PatternRepository.get(id)`
- `PatternRepository.save(pattern)`
- `PatternRepository.delete(id)`
- `AuthService.getSession()`
- `SyncService.pushChanges()`

En el MVP estos contratos apuntarán a almacenamiento local. En fases posteriores podrán enlazarse con una API sin modificar los componentes visuales.
