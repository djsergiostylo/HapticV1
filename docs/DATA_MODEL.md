# Modelo de datos

## Pattern

```json
{
  "id": "pattern_uuid",
  "name": "Mi patrón",
  "version": 1,
  "createdAt": "2026-06-27T00:00:00.000Z",
  "updatedAt": "2026-06-27T00:00:00.000Z",
  "source": "manual",
  "segments": [],
  "settings": {
    "globalIntensity": 0.5,
    "loop": false,
    "maxContinuousMs": 3000
  }
}
```

## Segment

```json
{
  "id": "segment_uuid",
  "type": "vibrate",
  "durationMs": 250,
  "intensity": 0.7,
  "shape": "pulse"
}
```

## Valores admitidos

- `type`: `vibrate` o `pause`.
- `shape`: `pulse`, `sustain`, `burst`, `ramp-up`, `ramp-down`.
- `durationMs`: entero positivo.
- `intensity`: número normalizado entre 0 y 1.
- `source`: `manual`, `preset`, `random`, `recorded` o `audio`.

## Reglas

- Todo patrón debe contener al menos un segmento.
- Ningún segmento puede tener duración igual o inferior a cero.
- La intensidad de una pausa debe ser cero.
- La reproducción debe pasar por el validador de seguridad.
- Los cambios incompatibles incrementarán `version`.

## Contrato futuro de API

```text
GET    /api/v1/patterns
GET    /api/v1/patterns/:id
POST   /api/v1/patterns
PUT    /api/v1/patterns/:id
DELETE /api/v1/patterns/:id
```

El MVP local implementará el mismo comportamiento mediante un repositorio en el navegador.
