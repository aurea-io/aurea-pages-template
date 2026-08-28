# 🏛️ Arquitectura Integral AUREA (v2)
### Servicios, Estructura de Proyecto y Modelado de Base de Datos

---

## 1. Principios de Diseño y Filosofía Agnóstica al Rubro

### Reglas Centrales
1. **Cero `if (rubro === 'restaurante')` en código**: El sistema opera mediante **Capacidades/Features (Feature Flags booleanos)** como `hasBookings`, `hasCatalog`, `hasDeliveryOrders`, `hasTableManagement`, `hasSocialLinks`, etc.
2. **El Rubro es puramente referencial**: El campo `vertical` o `industry` vive en la base de datos para analíticas, plantillas iniciales o SEO, sin condicionar la lógica del backend ni del frontend.
3. **Validación Tridimensional de Acceso**:
   > **Acceso Permitido** = Tenant Activo + Feature Habilitada (por Plan o Extra) + Permiso del Rol (RBAC)

---

## 2. Mapa de Servicios

| Servicio | Audiencia | Responsabilidades Principales |
| :--- | :--- | :--- |
| **1. BackOffice AUREA** | SuperAdmin AUREA | • Onboarding y alta de nuevos Tenants / Comercios.<br>• Asignación del Plan base contratado.<br>• Activación / Desactivación de Features extras.<br>• Facturación de plataforma y métricas globales. |
| **2. BackOffice Cliente** | Dueño / Empleados del Comercio | • Configuración general del negocio (branding, horarios, datos de contacto).<br>• Gestión operativa de módulos activos (turnos, pedidos, catálogo, mesas).<br>• Gestión de usuarios colaboradores y asignación de roles. |
| **3. Portal Cliente Final (Frontend Multimódulo)** | Clientes finales del comercio | • Aplicación web / PWA única que resuelve el negocio por subdominio o slug (`/slug`).<br>• Renderizado condicional dinámico de submódulos según las features activas del negocio (Sacar turnos, ver menú/catálogo, pedir delivery, ver redes sociales/reseñas). |

---

## 3. Estructura de Carpetas (Monorepo Turborepo / PNPM Workspaces)

```text
aurea-platform/
├── apps/
│   ├── backoffice-aurea/              # 🏢 BackOffice Global (SuperAdmin AUREA)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── tenants/          # Onboarding de clientes, alta de comercios
│   │   │   │   ├── plans/            # Definición de planes y features base
│   │   │   │   ├── feature-overrides/# Asignación de módulos extra a medida
│   │   │   │   └── metrics/          # Facturación global y métricas de plataforma
│   │   │   └── main.tsx
│   │
│   ├── backoffice-client/             # 🏪 BackOffice del Comercio (Dueño / Empleados)
│   │   ├── src/
│   │   │   ├── guards/               # FeatureGuard & RoleGuard (oculta/muestra paneles)
│   │   │   ├── modules/
│   │   │   │   ├── settings/         # Configuración general, branding, horarios
│   │   │   │   ├── team/             # Gestión de colaboradores y roles
│   │   │   │   ├── bookings/         # Gestión de turnos / citas
│   │   │   │   ├── catalog/          # Gestión de productos / servicios
│   │   │   │   ├── orders/           # Gestión de pedidos y comandas
│   │   │   │   └── tables/           # Gestión de mesas / salones
│   │   │   └── main.tsx
│   │
│   ├── portal-client/                 # 📱 Frontend Público Dinámico (PWA Cliente Final)
│   │   ├── src/
│   │   │   ├── engine/               # Resuelve config y features del slug/subdominio
│   │   │   ├── modules/              # Submódulos desacoplados y configurables
│   │   │   │   ├── bookings/         # Sacar turno / reserva
│   │   │   │   ├── menu-catalog/     # Ver menú / catálogo interactivo
│   │   │   │   ├── delivery-takeout/ # Carrito y pedidos por delivery / retiro
│   │   │   │   ├── social-hub/       # Enlaces a redes, WhatsApp, reseñas, ubicación
│   │   │   │   └── showcase/         # Galería de trabajos / fotos
│   │   │   └── main.tsx
│   │
│   └── api/                           # ⚙️ API Backend Modular (NestJS + Fastify)
│       ├── src/
│       │   ├── core/
│       │   │   ├── auth/             # JWT, sesiones, login multi-tenant
│       │   │   ├── tenancy/          # Interceptor de resolución de Tenant (slug / header)
│       │   │   ├── permissions/      # Guards RBAC (Roles)
│       │   │   └── feature-engine/   # Guard que valida si el tenant tiene la feature activa
│       │   ├── modules/
│       │   │   ├── platform-admin/   # Endpoints exclusivos para SuperAdmin Aurea
│       │   │   ├── tenant-admin/     # Endpoints de gestión para Dueño/Empleado
│       │   │   ├── public-portal/    # Endpoints públicos cacheados para clientes finales
│       │   │   ├── bookings/         # Lógica de turnos y disponibilidad
│       │   │   ├── catalog/          # Lógica de productos, variantes y servicios
│       │   │   ├── orders/           # Lógica de pedidos y checkout
│       │   │   └── payments/         # Webhooks (Mercado Pago, Stripe, etc.)
│       │   └── main.ts
│
├── packages/
│   ├── database/                      # Esquemas ORM (Prisma/Drizzle/Mongoose), migraciones, seeds
│   ├── contracts/                     # DTOs, interfaces compartidas y validaciones Zod
│   ├── feature-flags/                 # Lista centralizada de Features disponibles y defaults
│   ├── ui/                            # Design System de componentes base
│   └── config/                        # Configuraciones compartidas (ESLint, TSConfig, etc.)
├── docsv2/                            # Documentación de la versión 2
├── package.json
└── turbo.json
```

---

## 4. Modelo de Base de Datos Relacional (PostgreSQL)

### Mapa de Relaciones de Entidades

| Entidad Origen | Cardinalidad | Entidad Destino | Descripción de la Relación |
| :--- | :---: | :--- | :--- |
| `plans` | 1 : N | `plan_features` | Define qué features incluye cada plan por defecto. |
| `features` | 1 : N | `plan_features` | Catálogo maestro de capacidades del sistema. |
| `plans` | 1 : N | `tenants` | Plan base contratado por cada establecimiento. |
| `tenants` | 1 : N | `tenant_feature_overrides` | Activa/desactiva features extra específicas para un tenant. |
| `tenants` | 1 : N | `tenant_users` | Asocia usuarios con un tenant y su rol correspondiente. |
| `users` | 1 : N | `tenant_users` | Un usuario puede pertenecer a uno o más tenants. |
| `roles` | 1 : N | `role_permissions` | Permisos asignados a cada rol dentro del tenant. |
| `tenants` | 1 : N | `catalog_items` | Productos físicos o servicios para turnos del tenant. |
| `tenants` | 1 : N | `bookings` | Reservas y citas del tenant. |
| `tenants` | 1 : N | `orders` | Pedidos (delivery, take-away, mesa) del tenant. |

---

### Esquema DDL en PostgreSQL

```sql
-- 1. CATÁLOGO GLOBAL DE FEATURES (Capacidades de la plataforma)
CREATE TABLE features (
    id VARCHAR(50) PRIMARY KEY, -- ej: 'bookings', 'delivery_orders', 'table_mgmt', 'catalog', 'social_hub'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PLANES DE SUSCRIPCIÓN
CREATE TABLE plans (
    id VARCHAR(50) PRIMARY KEY, -- ej: 'plan_basic', 'plan_pro', 'plan_enterprise'
    name VARCHAR(100) NOT NULL,
    price_cents INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Features incluidas por defecto en cada plan
CREATE TABLE plan_features (
    plan_id VARCHAR(50) REFERENCES plans(id) ON DELETE CASCADE,
    feature_id VARCHAR(50) REFERENCES features(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, feature_id)
);

-- 3. TENANTS (Establecimientos)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL, -- ej: 'pizzeria-napoles', 'estetica-glam'
    name VARCHAR(150) NOT NULL,
    vertical_reference VARCHAR(50) NOT NULL, -- Dato informativo: 'gastronomia', 'belleza', 'salud'
    plan_id VARCHAR(50) REFERENCES plans(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    config JSONB DEFAULT '{}'::jsonb, -- Configs estéticas: colores, redes, logo, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. OVERRIDES DE FEATURES (Asignadas extra o deshabilitadas desde BackOffice AUREA)
CREATE TABLE tenant_feature_overrides (
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    feature_id VARCHAR(50) REFERENCES features(id) ON DELETE CASCADE,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (tenant_id, feature_id)
);

-- 5. USUARIOS, ROLES Y PERMISOS (RBAC Multi-tenant)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    is_aurea_superadmin BOOLEAN DEFAULT FALSE, -- Acceso a BackOffice AUREA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- 'Dueño', 'Encargado', 'Cajero', 'Especialista'
    is_system_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE permissions (
    id VARCHAR(50) PRIMARY KEY, -- 'bookings:write', 'catalog:manage', 'orders:accept'
    description TEXT
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(50) REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE tenant_users (
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, user_id)
);

-- 6. MÓDULOS DE NEGOCIO (Siempre aislados por tenant_id)
CREATE TABLE catalog_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    price_cents INT NOT NULL,
    is_service BOOLEAN DEFAULT FALSE, -- TRUE: Turnos/Servicios | FALSE: Producto físico/Menú
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    item_id UUID REFERENCES catalog_items(id),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' -- PENDING, CONFIRMED, CANCELLED
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    order_type VARCHAR(30) NOT NULL, -- 'DELIVERY', 'TAKE_AWAY', 'TABLE'
    total_cents INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'RECEIVED',
    items JSONB NOT NULL
);
```

---

## 5. Modelo de Base de Datos No Relacional (MongoDB / Document-Based)

### Estructura de Documentos JSON

#### Colección `tenants`
```json
{
  "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "slug": "pizzeria-napoles",
  "name": "Pizzería Nápoles",
  "vertical_reference": "gastronomia",
  "plan": {
    "id": "plan_pro",
    "name": "Plan Pro"
  },
  "features": {
    "bookings": false,
    "catalog": true,
    "delivery_orders": true,
    "table_mgmt": true,
    "social_hub": true,
    "reviews": true
  },
  "settings": {
    "brand_color": "#E63946",
    "logo_url": "https://cdn.aurea.io/logos/napoles.webp",
    "social_links": {
      "instagram": "https://instagram.com/napoles",
      "whatsapp": "+5491122334455"
    },
    "schedule": {
      "monday": { "open": "19:00", "close": "00:00" },
      "tuesday": { "open": "19:00", "close": "00:00" }
    }
  },
  "is_active": true,
  "created_at": "2026-08-27T20:00:00Z"
}
```

#### Colección `users`
```json
{
  "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
  "email": "dueno@napoles.com",
  "password_hash": "$2b$12$...",
  "full_name": "Mario Rossi",
  "is_aurea_superadmin": false,
  "tenants": [
    {
      "tenant_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "role": "OWNER",
      "permissions": ["*"]
    }
  ]
}
```

#### Colección `catalog_items`
```json
{
  "_id": "65f1a2b3c4d5e6f7a8b9c0d3",
  "tenant_id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "title": "Pizza Margherita",
  "description": "Salsa de tomate, mozzarella fior di latte, albahaca",
  "price_cents": 1200000,
  "category": "Pizzas Tradicionales",
  "is_service": false,
  "is_active": true,
  "options": [
    { "name": "Masa", "choices": ["Tradicional", "Madre (+10%)"] }
  ]
}
```

#### Colección `bookings` & `orders`
```json
{
  "_id": "65f1a2b3c4d5e6f7a8b9c0d4",
  "tenant_id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "order_type": "DELIVERY",
  "status": "IN_PREPARATION",
  "customer": {
    "name": "Juan Pérez",
    "phone": "+5491199887766",
    "address": "Av. Corrientes 1234, 4B"
  },
  "items": [
    { "item_id": "65f1a2b3c4d5e6f7a8b9c0d3", "title": "Pizza Margherita", "qty": 2, "unit_price_cents": 1200000 }
  ],
  "total_cents": 2400000,
  "created_at": "2026-08-27T20:15:00Z"
}
```

---

## 6. Comparativa Técnica y Recomendación

| Criterio | Relacional (PostgreSQL + JSONB) ⭐ **(Recomendada)** | No Relacional (MongoDB) |
| :--- | :--- | :--- |
| **Aislamiento Multi-Tenant** | Nativo mediante `tenant_id` indexado y Row-Level Security (RLS). | Filtro explícito `{ tenant_id: ... }` en cada query. |
| **Transacciones & Consistencia** | ACID estricto (crucial para turnos sin solapamiento y pagos). | ACID por documento; transacciones multisesión más costosas. |
| **Flexibilidad de Configuración** | Híbrido: tablas tipadas para relaciones + columnas `JSONB` para settings. | Alta: esquema dinámico de documentos. |
| **Escalabilidad** | Excelente con particionado por tenant o sharding si se requiere. | Excelente sharding horizontal basado en clave `tenant_id`. |

---

## 7. Flujo de Renderizado Dinámico en Frontend (Portal Cliente Final)

```tsx
// Ejemplo conceptual en portal-client:
export function DynamicTenantApp({ tenantConfig }) {
  const { features, settings } = tenantConfig;

  return (
    <Layout branding={settings}>
      {/* Cada submódulo se renderiza únicamente si la feature está habilitada */}
      {features.bookings && <BookingsWidget tenantId={tenantConfig.id} />}
      {features.catalog && <InteractiveCatalog tenantId={tenantConfig.id} />}
      {features.delivery_orders && <DeliveryCartWidget />}
      {features.social_hub && <SocialHubLinks links={settings.social_links} />}
      {features.reviews && <ReviewsCarousel />}
    </Layout>
  );
}
```
