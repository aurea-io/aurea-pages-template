# Visión y alcance

## Resumen

Aurea Pages Template es una base para construir aplicaciones verticales para pequeños negocios. Cada instalación debe poder incluir únicamente los módulos que necesita el cliente y conservar un núcleo común de identidad, configuración, permisos y operación.

## Problema

Muchos negocios pequeños necesitan resolver varias tareas —agenda, pedidos, clientes, pagos y control interno— pero no pueden justificar una solución empresarial compleja. Una página estática resuelve la presencia digital, pero no captura reglas operativas ni reduce trabajo administrativo.

## Propuesta de valor

Ofrecer una página pública y una herramienta de gestión en una misma solución, con activación gradual de funcionalidades: comenzar con una necesidad clara, permitir crecer sin migrar, entregar una experiencia móvil mediante PWA, utilizar QR o NFC como punto de entrada físico y administrar módulos según el plan contratado.

## Usuarios

- **Cliente final:** consulta servicios o productos y realiza una reserva o pedido sin necesitar una cuenta completa.
- **Operador del negocio:** administra agenda, pedidos, clientes, catálogo y condiciones de atención.
- **Administrador de plataforma:** gestiona tenants, planes, módulos, soporte, auditoría y configuración global.

## Producto inicial: turnos

El POC debe permitir que un negocio publique categorías y servicios con variantes, duración, precio y reglas de disponibilidad. Un cliente debe poder reservar, pagar una seña configurable y recibir una confirmación.

## Alcance incluido en el POC

- Multi-tenant básico, usuarios, roles y autenticación.
- Perfil público del negocio.
- Categorías, servicios, variantes, horarios y excepciones.
- Reserva pública y panel administrativo.
- Estados de reserva, reprogramación y cancelación.
- Seña mediante proveedor de pago o comprobante manual.
- Cliente asociado a su historial.
- Pruebas de reglas críticas.

## Fuera de alcance inicial

- Marketplace público, control de acceso físico, gestión completa de mesas, stock y recetas.
- Publicación automática en redes sociales.
- Blockchain o contratos digitales.
- Aplicaciones nativas.

## Criterios de éxito

- Un negocio se configura sin intervención técnica para publicar sus servicios.
- Un cliente completa una reserva desde un dispositivo móvil.
- El sistema evita doble reserva y respeta pausas, bloqueos y duración.
- El administrador entiende el estado de cada reserva y puede actuar sobre ella.
- La base permite activar módulos sin mezclar reglas de dominios distintos.
