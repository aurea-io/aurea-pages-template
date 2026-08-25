# Aurea Pages Template

Template de plataforma modular para pequeños negocios, orientado a crear productos digitales configurables a partir de un núcleo común.

> **Estado actual:** etapa de definición y POC. Este repositorio contiene documentación de producto y arquitectura; la implementación del backend y frontend todavía debe construirse.

## Qué problema resuelve

La plataforma busca que un negocio pueda publicar sus servicios o productos, recibir reservas o pedidos y administrar su operación desde una aplicación web instalable como PWA. La propuesta combina una página pública accesible por enlace, QR o NFC, un panel privado, módulos activables, aislamiento de datos por negocio e integraciones desacopladas.

El primer producto recomendado es un sistema de turnos para profesionales de belleza y servicios personalizados. Luego puede extenderse a menús digitales, pedidos, mesas, stock, recetas, fidelización y gestión de inventario.

## Índice de documentación

### Producto y alcance

- [Visión y alcance](docs/producto/vision-y-alcance.md)
- [Investigación y referencia](docs/producto/investigacion.md)
- [Roadmap](docs/producto/roadmap.md)

### Diseño técnico

- [Arquitectura](docs/tecnico/arquitectura.md)
- [Stack tecnológico](docs/tecnico/stack.md)
- [Modelo de dominio](docs/tecnico/modelo-de-dominio.md)
- [Seguridad y privacidad](docs/tecnico/seguridad-y-privacidad.md)

### Módulos funcionales

- [Catálogo y turnos](docs/modulos/turnos.md)
- [Clientes y fidelización](docs/modulos/clientes.md)
- [Pagos](docs/modulos/pagos.md)
- [Menú, pedidos y mesas](docs/modulos/pedidos-y-mesas.md)
- [Stock y costos](docs/modulos/stock-y-costos.md)

### Uso y operación

- [Guía de uso](docs/uso/guia-de-uso.md)
- [Configuración](docs/uso/configuracion.md)
- [Desarrollo local](docs/operacion/desarrollo-local.md)
- [Pruebas](docs/operacion/pruebas.md)
- [Despliegue y operación](docs/operacion/despliegue.md)
- [Decisiones pendientes](docs/decisiones-pendientes.md)

### Entregable ejecutable

- [POC v1 — gestor y página pública](docs/poc-v1.md)
- [Guía de ejecución de la POC](apps/web/README.md)

También está disponible el [índice de documentación](docs/README.md).

## Stack objetivo

| Área | Tecnología objetivo | Estado |
| --- | --- | --- |
| Backend | NestJS + Fastify | Definido en la propuesta inicial |
| Frontend | React + Vite | Definido en la propuesta inicial |
| Aplicación cliente | PWA | Objetivo del producto |
| Persistencia | PostgreSQL | Recomendado para el POC |
| API | HTTP REST versionada | Propuesta |
| Pagos | Adaptador para Mercado Pago | Requerido para la primera versión comercial |
| Calidad | Unitarias, integración y E2E | Requerido |

## Inicio rápido de documentación

Como todavía no hay código ejecutable, el punto de entrada es [Desarrollo local](docs/operacion/desarrollo-local.md). Para entender la decisión de producto, leer en este orden:

1. [Visión y alcance](docs/producto/vision-y-alcance.md)
2. [Investigación y referencia](docs/producto/investigacion.md)
3. [Arquitectura](docs/tecnico/arquitectura.md)
4. [Catálogo y turnos](docs/modulos/turnos.md)
5. [Pruebas](docs/operacion/pruebas.md)

## Principios del proyecto

1. Validar un producto pequeño antes de construir una suite completa.
2. Mantener los módulos separados por dominio y con dependencias explícitas.
3. Aplicar el aislamiento por tenant en backend, base de datos y pruebas.
4. No acoplar el dominio a un proveedor externo de pagos o notificaciones.
5. Priorizar una experiencia móvil simple, rápida y comprensible.
6. Documentar decisiones y actualizar esta guía cuando cambie el diseño.

## Licencia y estado legal

El repositorio todavía no declara una licencia. Antes de distribuir el template o vender instalaciones deben definirse la licencia, el tratamiento de datos personales, los términos del servicio y las responsabilidades sobre integraciones de terceros.
