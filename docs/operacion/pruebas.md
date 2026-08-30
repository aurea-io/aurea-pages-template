# Pruebas

## Pirámide

### Unitarias

Validan reglas aisladas: duración, disponibilidad, solapamientos, estados, cálculo de seña y fidelización.

### Integración

Validan casos de uso con base de datos y adaptadores controlados: crear reserva, reprogramar, procesar webhook e impedir acceso cruzado entre tenants.

### End-to-end

Validan el recorrido público y administrativo desde el navegador: seleccionar servicio, elegir horario, completar datos, pagar en sandbox y confirmar.

### Contratos

Validan que frontend, API e integraciones externas respeten los esquemas publicados.

## Casos obligatorios del POC

- reserva exitosa;
- horario ocupado;
- servicio desactivado;
- bloqueo de fecha;
- pausa dentro de una jornada;
- duración que cruza un límite de horario;
- pago aprobado y rechazado;
- webhook repetido;
- cancelación y reprogramación;
- acceso de usuario a otro tenant;
- slug público inexistente;
- datos inválidos y rate limiting.

## Calidad mínima

Antes de integrar cambios deben pasar formato, lint, chequeo de tipos, pruebas y build. La cobertura es una señal, no reemplaza los casos de negocio críticos.
# Pruebas

## POC actual

El CI valida la sintaxis del servidor Node, los contratos de `/health` y
`/metrics`, los tests de Node y la construcción de la imagen Docker. La POC
frontend se ejecuta como un script de navegador y se mantiene fuera del
chequeo de sintaxis del servidor hasta su migración a módulos.
