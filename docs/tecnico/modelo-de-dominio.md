# Modelo de dominio

## Entidades del núcleo

- `Tenant`: negocio o instalación lógica.
- `User`: identidad autenticada.
- `Membership`: relación de usuario con tenant y rol.
- `Role`: permisos agrupados.
- `BusinessProfile`: nombre, imagen, descripción, contacto y ubicación.
- `ModuleSubscription`: módulos habilitados y plan asociado.

## Entidades del POC de turnos

- `ServiceCategory`: agrupador público.
- `Service`: servicio base.
- `ServiceVariant`: variante con duración, precio y descripción.
- `AvailabilityRule`: horario recurrente.
- `AvailabilityException`: bloqueo o disponibilidad especial.
- `Customer`: persona que reserva dentro del tenant.
- `Booking`: reserva, intervalo, estado, importe y cliente.
- `Payment`: seña, proveedor, referencia externa y estado.

## Reglas principales

1. Una reserva pertenece a un solo tenant y a una variante de servicio.
2. La duración de la variante determina el intervalo ocupado.
3. Una reserva no puede solaparse con otra confirmada o pendiente según la política configurada.
4. Desactivar un servicio no elimina reservas históricas.
5. Reprogramar conserva trazabilidad del horario original.
6. Un webhook repetido no debe duplicar un pago ni cambiar dos veces una reserva.
7. Los importes se almacenan en unidades enteras de moneda y con moneda explícita.
8. Todas las fechas se guardan con zona horaria definida.

## Estados de reserva

```text
PENDING_PAYMENT → CONFIRMED → IN_PROGRESS → COMPLETED
       │              │             │
       ├──────────────┴─────────────┴── CANCELLED
       └─────────────────────────────── EXPIRED
```

También pueden existir `RESCHEDULED` y `NO_SHOW` como estados o eventos, según la decisión de auditoría.

## Estados de pago

```text
CREATED → PENDING → APPROVED
             │          │
             ├──────────┴── REJECTED
             └───────────── EXPIRED
```

El proveedor externo nunca debe ser la única fuente del estado interno: se debe guardar la referencia, recibir callbacks idempotentes y registrar la transición.
