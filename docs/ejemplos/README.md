# Ejemplos comerciales

Esta sección separa los entregables de la POC por solución comercial. Cada carpeta incluye una ficha lista para presentar, explicar o usar como base de una propuesta.

| Solución | Cliente ideal | Entregable |
| --- | --- | --- |
| [Turnos](turnos/README.md) | Profesionales y estudios de servicios | Reservas online y gestor de agenda |
| [Restaurante](restaurante/README.md) | Restaurantes y bares | Menú digital, mesa compartida y pedidos |
| [Stock](stock/README.md) | Elaboradores y comercios | Catálogo, disponibilidad y reservas |
| Restaurante | Restaurantes y bares | Menú, mesas, pedidos, caja y vista mozo |

## Cómo presentar los ejemplos

1. Ejecutar la POC desde [apps/web/README.md](../../apps/web/README.md).
2. Abrir el ejemplo correspondiente desde su ruta de demo.
3. Usar el README de cada carpeta como guion comercial.
4. Mostrar las imágenes de `media/` como apoyo visual cuando no se esté ejecutando la aplicación.

La implementación actual comparte un núcleo visual y de estado en `apps/web/app.js`; las carpetas de esta sección separan las propuestas comerciales y sus entregables. La vista Mozo forma parte del ejemplo Restaurante. La separación técnica por módulos puede abordarse en una siguiente iteración.
