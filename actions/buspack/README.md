# BusPack Scraper

Scraper para extraer información de seguimiento de envíos desde BusPack.

## URL Base

```
https://netsolutions.empresar-sys.com.ar:27576/apps/gspclientes/
```

## Parámetros Requeridos

BusPack requiere 3 parámetros dinámicos en la URL:

- **Letra**: Código de letra (ej: "r", "R")
- **Boca**: Código de boca/sucursal (ej: "3101")
- **Numero**: Número de envío (ej: "10055")

## Formato de Entrada

El número de comprobante de BusPack tiene el formato: `LETRA-BOCA-NUMERO`

Ejemplo: `R-3101-10055`

Se debe parsear en:
```typescript
{
  letra: "r",
  boca: "3101",
  numero: "10055"
}
```

## Uso

```typescript
import { trackBusPack } from "@/actions/buspack/track";

// Con parámetros separados
const result = await trackBusPack({
  letra: "r",
  boca: "3101",
  numero: "10055"
});
```

## Datos Extraídos

### Información Principal
- ✅ **Estado actual**: Entregado, En camino, etc.
- ✅ **Fecha y hora**: Timestamp del estado actual
- ✅ **Nro. de comprobante**: Código completo (R-3101-10055)
- ✅ **Cantidad de piezas**: Número de paquetes
- ✅ **Número/s de Pieza/s**: IDs individuales
- ✅ **Peso Total**: En kilogramos
- ✅ **Receptor**: Nombre de quien recibió
- ✅ **Tipo y número de Documento**: DNI u otro
- ✅ **Agencia destino**: Ciudad/sucursal destino

### Historial de Seguimiento (Timeline)
Tabla con:
- Fecha y hora de cada evento
- Estado en cada punto

## Diferencias con Via Cargo

| Campo | BusPack | Via Cargo |
|-------|---------|-----------|
| Formato entrada | Letra-Boca-Numero | Número único |
| Origen | ❌ No muestra | ✅ Sí muestra |
| Destino | ✅ Ciudad | ✅ Dirección completa |
| Timeline location | ❌ No incluye | ✅ Incluye ubicaciones |
| Incidencias | ❌ No muestra | ✅ Sí muestra |
| Datos extras | Número de piezas individual | Servicio utilizado |

## Estructura de Respuesta

```typescript
{
  success: true,
  data: {
    trackingNumber: "R-3101-10055",
    origin: "",  // No disponible en BusPack
    destination: "CHIVILCOY (BUE)",
    pieces: "1",
    weight: "No especificado",
    signedBy: "LEONARDO",
    service: "BusPack",
    timeline: [
      {
        location: "",
        datetime: "24/09/2025 13:59",
        status: "En Agencia Origen"
      },
      // ... más eventos
    ],
    incidents: "No hay incidencias."
  }
}
```

## Validaciones

- ✅ Verifica que los 3 parámetros estén presentes
- ✅ Valida que no estén vacíos
- ✅ Confirma que se encontró el número de comprobante en la respuesta
- ✅ Maneja errores de conexión y timeout

## Notas Técnicas

- **Tiempo de espera**: ~5-10 segundos (incluye navegación + renderizado)
- **Timeout**: 30 segundos para navegación, 15 segundos para resultados
- **Indicador de carga**: Detecta cuando deja de mostrar "Buscando"
- **Tabla dinámica**: Extrae historial de tabla HTML renderizada
