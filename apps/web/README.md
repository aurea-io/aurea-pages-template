# POC v1 — Gestor y entregable público

Esta carpeta contiene una demo funcional autocontenida de Aurea Pages.

## Qué incluye

- **Gestor:** resumen operativo y selector de negocio para turnos, restaurante, stock y vista mozo.
- **Turnos:** página de ejemplo para `De Santas Beauty Spa`, selección de servicio, fecha, horario, datos del cliente y confirmación.
- **Restaurante:** escenario preconfigurado en mesa 3 para cuatro personas, con sesión `Yo`, pedidos reales de ejemplo, menú de `La Esquina`, sesión por celular con nombre y mesa, asignación automática, opción de sumarse al pedido de otra persona, reparto individual o compartido y ticket separado. La cuenta se consulta desde `Ver pedidos` o `Ver ticket`, sin recargar la pantalla principal.
- **Stock:** catálogo público de `Miga` condicionado por disponibilidad, carrito de retiro y gestor de inventario con alertas, movimientos y producción.
- **Persistencia local:** los servicios nuevos y las reservas creadas se guardan en `localStorage` del navegador.
- **Navegación:** `#public` muestra la página pública, `#restaurant` el restaurante, `#stock` stock, `#admin-restaurant` el gestor del restaurante, `#admin-stock` el gestor de stock y `#waiter` la vista mobile-first del mozo.

## Ejecutar localmente

Como esta POC no depende de un backend ni de un bundler, puede servirse con cualquier servidor HTTP estático:

```bash
cd apps/web
python3 -m http.server 4173
```

Abrir <http://localhost:4173/apps/web/> para el entregable de turnos, `#restaurant` para el restaurante, `#stock` para stock o `#admin`, `#admin-restaurant` y `#admin-stock` para sus gestores.

## Datos de demo

Los datos iniciales representan negocios ficticios. No son datos de producción ni están conectados a Mercado Pago. Los pagos y pedidos se simulan en el navegador para validar los flujos de producto. En esta POC la sesión y la mesa viven en el navegador; un backend deberá compartirlas entre dispositivos reales y sincronizar los pedidos en tiempo real.

## Próximo paso técnico

Migrar la UI a React + Vite dentro de `apps/web`, extraer la persistencia a la API NestJS/Fastify y reemplazar los datos locales por PostgreSQL y un adaptador de pagos.
