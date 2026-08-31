# Decisiones y respuestas — módulos dinámicos

**Estado:** decisiones de producto y arquitectura para módulos dinámicos  
**Fuente:** respuestas del equipo a la revisión de seguridad, performance, personalización, mantenibilidad y escalamiento.

## Decisiones confirmadas

### Tenants y usuarios

- Un usuario pertenece a un solo tenant.
- Un tenant puede tener varios empleados.
- El cliente puede gestionar sus empleados.
- El `tenantId` no se acepta del body como fuente de autorización.
- Un acceso cruzado responde `403` sin revelar si el recurso de otro tenant existe.

### Roles

Los roles de plataforma y de tenant tienen scopes independientes:

```text
Platform: platform_owner, platform_readonly
Tenant: tenant_admin, employee, bookings_manager, inventory_manager
```

Un empleado puede tener varios roles. Las capabilities declaran permisos; los roles contienen esos permisos. El scope platform queda reservado a usuarios de AUREA. `platform_owner` debe ser explícito y auditable, no un permiso universal llamado simplemente `owner`.

MFA y restricciones geográficas son capas adicionales a evaluar; la primera regla geográfica será por país.

### Módulos, funciones y superficies

La unidad técnica es el módulo. Sus funciones pueden ser consumidas por distintas superficies:

```text
Módulo Reservas
├── Features: crear, reprogramar, fotos
├── Backoffice del cliente
├── Página pública
└── Permisos y datos del dominio
```

Una función no pertenece a una sola pantalla. `services.bookings.photo_upload` puede aparecer en la página pública y en el backoffice del cliente. Las páginas pueden tener una versión completa o reducida según las capabilities efectivas, y el cliente final no debe ver controles inactivos.

### Planes, créditos y addons

- Un tenant puede tener un plan y addons.
- Un plan puede conceder créditos para seleccionar módulos.
- Los límites operativos se gestionan dentro de cada módulo.
- Planes, precios, membresías y addons se administran desde el backoffice AUREA.
- Los precios conservan historial.

La recomendación inicial es usar créditos mensuales no acumulables. Al desactivar un módulo, los créditos se liberan durante el período actual. Los addons tienen vencimiento y renovación según la suscripción.

```text
Plan Pro: 100 créditos mensuales
Reservas: 40 créditos
Stock: 30 créditos
Pagos: 20 créditos
Addon: +100 créditos mensuales
```

### Suscripciones vencidas

```text
Pago vencido:
- la página pública sigue igual durante 14 días;
- el backoffice queda inhabilitado;
- se muestra una notificación;
- no se borran datos.

Después de 14 días:
- el tenant pasa a política suspendida;
- la página pública puede bloquear nuevas operaciones;
- los datos quedan conservados.
```

La regla se implementa en una política central, no endpoint por endpoint.

### Personalización

- La aplicación React es la misma para todos los tenants.
- Se permiten colores, imágenes, fuentes soportadas, variantes de componentes y cambios acotados de layout.
- No se permite un layout completamente libre ni CSS arbitrario inicialmente.
- Se recomienda preview antes de publicar.
- Se conservan las últimas cuatro versiones publicadas y un borrador.
- Los campos adicionales pueden ser dinámicos, pero deben validarse contra un catálogo de tipos y keys.
- Se contemplan dominios personalizados.

### Theme Service

- MongoDB guarda tokens estructurados.
- `Theme Service` genera y sirve CSS por HTTP.
- El endpoint es público y usa un identificador opaco/versionado: `/style/123123123.css?v=4`.
- Redis es opcional y no crítico.
- MongoDB es crítico: si no está disponible, el servicio responde `503`.
- El servicio puede escalar en servidores separados para tenants con mucho tráfico.
- Un CDN es opcional: cachea la respuesta HTTP, pero el CSS sigue siendo generado por el servicio.

### Mantenimiento y lifecycle

- Los módulos pueden ponerse en mantenimiento global sin alterar la selección del tenant.
- Una función retirada pasa por `toBeDeprecated` y luego `deprecated`.
- No se borra automáticamente una capability del catálogo.
- Los datos se conservan por defecto; algunas funciones pueden declarar TTL.
- Se contemplan ambientes `development` y `production`; la POC visual no necesita implementarlos todavía.

## Decisiones técnicas derivadas

### Dependencias

Una feature puede requerir otras. Si un padre queda inactivo, los hijos quedan inactivos. La activación valida dependencias antes de confirmar.

### Desactivación

Desactivar bloquea nuevas operaciones, pero no elimina datos automáticamente. Cada módulo puede declarar una política `forever` o `ttl`; el borrado requiere auditoría, aviso y una tarea controlada.

### Sesiones

Revocar sesiones significa invalidar las sesiones activas cuando se elimina un empleado o cambia un permiso sensible. No es imprescindible para la POC visual, pero debe estar previsto para producción mediante `sessionVersion` o refresh tokens revocables.

### CDN

Un CDN no implica administrar archivos manualmente. Puede cachear la respuesta de `Browser → CDN → Theme Service → MongoDB`. Se puede omitir inicialmente y agregar cuando un tenant necesite más capacidad.

## Preguntas que siguen abiertas

1. ¿Los créditos se descuentan por activación o también por consumo operativo?
2. ¿Qué proveedor de pagos y facturación se integrará?
3. ¿Los addons se renuevan automáticamente?
4. Después de los 14 días, ¿se bloquean todas las operaciones públicas o solo las nuevas?
5. ¿Qué países se permiten en la primera etapa?
6. ¿Qué proveedor se usará para dominios personalizados y verificación DNS?
7. ¿Qué funciones tendrán TTL y cuál será su período de retención?
8. ¿MFA será obligatorio para `platform_owner` desde el primer release?
9. ¿Qué puede consultar un usuario de plataforma al inspeccionar un tenant?
10. ¿La POC debe demostrar créditos y addons o alcanza con documentarlos?
