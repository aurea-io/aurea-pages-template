# Desarrollo local

## Estado actual

La POC se sirve con Node.js y puede ejecutarse directamente o mediante Docker Compose. No hay backend ni migraciones en esta etapa.

## Requisitos esperados

- Node.js en versión LTS definida por el proyecto.
- npm incluido con Node.js 22 o superior.
- Git.
- Docker y Docker Compose para observabilidad local.

## Flujo de trabajo

1. Crear una rama de trabajo desde `main`.
2. Ejecutar `npm install` y `npm run check`.
3. Ejecutar `npm test`.
4. Levantar la aplicación con `npm start` o `docker compose up -d`.
5. Con Docker Compose, revisar `/health`, Prometheus en `localhost:9090` y Grafana en `localhost:3000`.
6. Actualizar documentación si cambia una decisión.

## Convenciones

- Commits pequeños y descriptivos.
- Todos los commits deben usar Conventional Commits: `feat:`, `fix:`, `perf:`,
  `refactor:`, `docs:`, `build:`, `chore:`, `test:`, `ci:` o `revert:`.
- Se admite un ámbito (`feat(web): ...`) y `!` indica un cambio incompatible
  (`feat!: ...`). `feat` aumenta minor; `fix` y el resto aumentan patch.
- Una responsabilidad por pull request.
- No mezclar refactors con cambios funcionales grandes.
- No subir secretos, dumps ni datos personales.
- Mantener contratos y migraciones versionados.
