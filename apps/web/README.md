# POC v1 — Gestor y entregable público

Esta carpeta contiene una demo funcional autocontenida de Aurea Pages.

## Qué incluye

- **Gestor:** resumen operativo, agenda del día, métricas mockeadas, catálogo de servicios y alta de un servicio nuevo.
- **Entregable público:** página de ejemplo para `De Santas Beauty Spa`, selección de servicio, fecha, horario, datos del cliente y confirmación.
- **Persistencia local:** los servicios nuevos y las reservas creadas se guardan en `localStorage` del navegador.
- **Navegación:** `#public` muestra la página pública y `#admin` muestra el gestor.

## Ejecutar localmente

Como esta POC no depende de un backend ni de un bundler, puede servirse con cualquier servidor HTTP estático:

```bash
cd apps/web
python3 -m http.server 4173
```

Abrir <http://localhost:4173> para el entregable público o <http://localhost:4173/#admin> para el gestor.

## Datos de demo

Los datos iniciales representan un negocio de belleza ficticio. No son datos de producción ni están conectados a Mercado Pago. El pago se representa como el estado `Seña pendiente` para validar el flujo de producto.

## Próximo paso técnico

Migrar la UI a React + Vite dentro de `apps/web`, extraer la persistencia a la API NestJS/Fastify y reemplazar los datos locales por PostgreSQL y un adaptador de pagos.
