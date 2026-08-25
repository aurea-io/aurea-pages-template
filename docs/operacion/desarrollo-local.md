# Desarrollo local

## Estado actual

El repositorio aún no contiene `package.json`, aplicaciones ni migraciones. Esta guía describe el entorno objetivo para la primera implementación y debe actualizarse cuando se cree el código.

## Requisitos esperados

- Node.js en versión LTS definida por el proyecto.
- Gestor de paquetes elegido por el equipo.
- PostgreSQL local o mediante Docker.
- Git.
- Cuenta sandbox del proveedor de pagos cuando se implemente esa integración.

## Flujo de trabajo

1. Crear una rama de trabajo desde `main`.
2. Instalar dependencias.
3. Copiar `.env.example` a `.env`.
4. Iniciar servicios locales.
5. Ejecutar migraciones y seeds de desarrollo.
6. Levantar API y frontend.
7. Ejecutar lint, tipos y pruebas.
8. Actualizar documentación si cambia una decisión.

## Convenciones

- Commits pequeños y descriptivos.
- Una responsabilidad por pull request.
- No mezclar refactors con cambios funcionales grandes.
- No subir secretos, dumps ni datos personales.
- Mantener contratos y migraciones versionados.
