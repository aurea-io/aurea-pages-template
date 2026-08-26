# POC v1 — Gestor y entregable de ejemplo

## Objetivo

Validar el primer producto con dos superficies conectadas por un mismo modelo de datos y tres escenarios comerciales:

1. un gestor para el negocio;
2. una página pública que el negocio puede compartir con sus clientes;
3. ejemplos concretos para turnos, restaurante y stock.

Las fichas comerciales independientes están disponibles en [examples/](../examples/README.md). La documentación de cada entregable vive dentro de su propio ejemplo.

## Alcance implementado

### Gestor administrativo

- Resumen con turnos del día, métricas y próximos pasos.
- Agenda de ejemplo con estados `Confirmado`, `Seña pendiente` y `Completado`.
- Catálogo de servicios publicados.
- Alta de nuevos servicios mediante modal.
- Enlace al entregable público.
- Persistencia de nuevos servicios y reservas en `localStorage`.

### Entregable público de turnos

- Landing de ejemplo para `De Santas Beauty Spa`.
- Información del negocio, ubicación y modalidad de atención.
- Selección de servicio y variante.
- Selección de fecha y horario.
- Datos mínimos del cliente.
- Confirmación con código de reserva.
- Creación de una reserva en el estado `Seña pendiente`.

### Entregable público de restaurante

- Escenario de prueba preconfigurado: mesa 3, cuatro personas y sesión activa `Yo`.
- Menú agrupado por categorías para `La Esquina`.
- Contexto de mesa y cantidad de comensales.
- Sesión de mesa por dispositivo: cada persona ingresa su nombre y número de mesa.
- Asignación automática del pedido al nombre de la sesión activa.
- Carrito por ítem.
- Modo individual, compartido entre participantes o compartido con toda la mesa.
- Acción para sumarse al pedido iniciado por otra persona.
- Nombre del comensal asociado a cada ítem.
- Envío del pedido a cocina como estado `En preparación`.
- Ticket separado por persona, con subtotales y total de la mesa.
- La pantalla principal mantiene el pedido simple; el detalle se consulta desde `Ver pedidos` o `Ver ticket`.
- `Ver pedidos` concentra la acción para sumarse o cambiar el modo de reparto.

### Entregable público de stock

- Catálogo de `Miga` con disponibilidad real del mock.
- Alertas visuales cuando quedan pocas unidades.
- Carrito para reservar productos y retirar.

### Gestores adicionales

- Restaurante: pedidos activos, mapa de mesas, menú, clientes, pagos, caja, QR y acciones rápidas.
- Stock: inventario, alertas de reposición, movimientos y producción del día.
- Mozo: vista mobile-first de mesas, pedidos para atender, estados y acciones rápidas.

### Experiencia responsive

El entregable público y la vista de mozo priorizan el uso desde celular: botones táctiles, navegación inferior, tarjetas compactas, paneles laterales y layouts de una columna en pantallas pequeñas.

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
- El menú, el carrito y el inventario son datos mockeados en `localStorage`.

## Criterio de evolución

La siguiente iteración debe conservar los flujos validados y reemplazar las partes mockeadas en este orden: API de reservas, autenticación y tenant, disponibilidad transaccional, persistencia PostgreSQL, integración de pagos y pruebas E2E.
