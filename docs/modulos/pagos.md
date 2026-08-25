# Módulo de pagos

## Objetivo

Gestionar señas y pagos sin acoplar el dominio a un proveedor específico.

## Contrato interno

El módulo debe abstraer crear intención, obtener estado, procesar webhook, cancelar o expirar y conciliar referencia externa.

## Mercado Pago

Mercado Pago es el proveedor inicial propuesto para Argentina. La integración debe vivir en un adaptador de infraestructura y mapear estados externos a estados internos definidos por el dominio.

## Transferencia manual

Como alternativa de POC, el administrador puede revisar un comprobante informado por el cliente. La reserva queda pendiente hasta la aprobación explícita y se registra quién realizó la acción.

## Requisitos

- idempotencia por operación;
- validación de webhooks;
- monto y moneda explícitos;
- trazabilidad;
- no almacenar tarjetas;
- pruebas con sandbox antes de producción.
