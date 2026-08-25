# Arquitectura

## Principios

- Separación por dominio y no solamente por tipo de archivo.
- Dependencias explícitas entre módulos.
- Núcleo pequeño, estable y reutilizable.
- Reglas de negocio ejecutadas en backend.
- Integraciones externas detrás de adaptadores.
- Contratos claros entre frontend y backend.
- Aislamiento de tenant aplicado en cada acceso a datos.

## Estructura objetivo

```text
apps/
  api/                 # NestJS + Fastify
  web/                 # React + Vite + PWA
packages/
  core/                # identidad, tenants, permisos, configuración
  bookings/            # turnos y disponibilidad
  customers/           # clientes e historial
  payments/            # contratos y adaptadores de pago
  orders/              # pedidos y productos
  tables/              # mesas y sesiones
  inventory/           # stock, recetas y costos
  ui/                  # componentes compartidos
  config/              # lint, tsconfig y convenciones
docs/
```

La estructura es una propuesta. Si el equipo adopta otra organización, debe conservar la separación conceptual y actualizar esta documentación.

## Capas del backend

1. **Entrada:** controladores, DTOs, validación y autenticación.
2. **Aplicación:** casos de uso y transacciones.
3. **Dominio:** entidades, reglas y eventos.
4. **Infraestructura:** ORM, proveedores externos, correo y almacenamiento.

El dominio no debe importar SDKs de Mercado Pago, frameworks web ni detalles de base de datos.

## Frontend

Debe separar página pública del tenant, flujo de reserva o pedido, panel administrativo, componentes compartidos, estado remoto y navegación por módulo. Puede ocultar módulos no instalados, pero la autorización real siempre debe ejecutarse en backend.

## Multi-tenant

Cada recurso de negocio debe tener `tenantId` o una relación equivalente. El contexto del tenant debe resolverse desde sesión, subdominio o slug y validarse contra la membresía del usuario.

La protección debe cubrir consultas, comandos, endpoints públicos, archivos, jobs, notificaciones, reportes, exportaciones y pruebas de acceso cruzado.

## API inicial sugerida

```text
GET    /api/v1/public/:slug
GET    /api/v1/public/:slug/services
GET    /api/v1/public/:slug/availability
POST   /api/v1/public/:slug/bookings
GET    /api/v1/bookings
PATCH  /api/v1/bookings/:id/status
POST   /api/v1/bookings/:id/reschedule
GET    /api/v1/services
POST   /api/v1/services
POST   /api/v1/payments/webhook/:provider
```

Las rutas son orientativas; antes de implementarlas deben definirse contratos, paginación, errores, idempotencia y versionado.
