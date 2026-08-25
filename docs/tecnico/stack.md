# Stack tecnológico

## Stack base

| Componente | Tecnología | Motivo |
| --- | --- | --- |
| Backend | NestJS | Modularidad, inyección de dependencias y estructura clara |
| HTTP | Fastify | Buen rendimiento y bajo overhead |
| Frontend | React | Ecosistema amplio y componentes reutilizables |
| Build frontend | Vite | Desarrollo rápido y configuración simple |
| Aplicación | PWA | Instalación sin depender de una tienda |
| Base de datos | PostgreSQL | Relaciones, transacciones y madurez operativa |
| API | REST/JSON versionada | Simplicidad para web e integraciones |
| Pagos | Mercado Pago mediante adaptador | Contexto comercial inicial en Argentina |
| Contenedores | Docker | Ambientes reproducibles |
| CI | Pipeline automatizado | Validación de lint, tipos, pruebas y build |

## Recomendaciones

- TypeScript de extremo a extremo.
- ESLint y Prettier con configuración compartida.
- ORM con migraciones versionadas y transacciones explícitas.
- OpenAPI para publicar contratos de API.
- Variables sensibles únicamente mediante entorno o gestor de secretos.
- Logs estructurados y correlación por request.

## Decisiones por confirmar

- ORM: Prisma, Drizzle o TypeORM.
- Monorepo: pnpm workspaces, Turborepo u otra alternativa.
- Autenticación: sesión segura, JWT rotado u operador externo.
- Correo y mensajería.
- Almacenamiento de imágenes.
- Proveedor de hosting y base de datos administrada.

## Criterio para cambiar el stack

Un cambio debe justificarse por costo operativo, soporte, seguridad, experiencia del equipo o una limitación concreta. La decisión debe registrar impacto en arquitectura, pruebas, despliegue y documentación.
