# POC v1 — Gestor y entregable de ejemplo

## Objetivo

Validar el primer producto con dos superficies conectadas por un mismo modelo de datos:

1. un gestor para el negocio;
2. una página pública que el negocio puede compartir con sus clientes.

## Alcance implementado

### Gestor administrativo

- Resumen con turnos del día, métricas y próximos pasos.
- Agenda de ejemplo con estados `Confirmado`, `Seña pendiente` y `Completado`.
- Catálogo de servicios publicados.
- Alta de nuevos servicios mediante modal.
- Enlace al entregable público.
- Persistencia de nuevos servicios y reservas en `localStorage`.

### Entregable público

- Landing de ejemplo para `De Santas Beauty Spa`.
- Información del negocio, ubicación y modalidad de atención.
- Selección de servicio y variante.
- Selección de fecha y horario.
- Datos mínimos del cliente.
- Confirmación con código de reserva.
- Creación de una reserva en el estado `Seña pendiente`.

## Cómo probarlo

```bash
cd apps/web
python3 -m http.server 4173
```

Luego abrir:

- <http://localhost:4173> — entregable público.
- <http://localhost:4173/#admin> — gestor.

## Limitaciones conocidas

- No hay backend, autenticación ni base de datos.
- Los datos son locales al navegador.
- Las métricas del gestor son mockeadas para la demo.
- El calendario muestra una vista fija.
- El estado de pago es simulado; no hay integración real con Mercado Pago.
- El acceso `#admin` es una navegación de demo, no una barrera de seguridad.

## Criterio de evolución

La siguiente iteración debe conservar los flujos validados y reemplazar las partes mockeadas en este orden: API de reservas, autenticación y tenant, disponibilidad transaccional, persistencia PostgreSQL, integración de pagos y pruebas E2E.
