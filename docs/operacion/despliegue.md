# Despliegue y operación

## Ambientes

Se recomienda separar desarrollo, staging y producción. Cada ambiente debe tener base de datos, secretos, URLs y proveedores de pago independientes.

## Pipeline

El workflow `.github/workflows/deploy.yml` es el único disparador de publicación.
Se ejecuta al actualizar `main` o manualmente desde GitHub Actions:

1. Instala Node.js 22 y valida con `npm ci`, `npm run check` y `npm test`.
2. Publica `apps/web` en Vercel mediante la CLI y secretos de GitHub.
3. Dispara el deploy del backend en Render mediante un deploy hook guardado como secreto.

Los secretos requeridos son `VERCEL_PROJECT_ID`, `VERCEL_TOKEN` y
`RENDER_DEPLOY_HOOK_URL`. Nunca deben escribirse en el repositorio, logs, archivos
`.env` versionados ni parámetros visibles del workflow.

El workflow de publicación de imágenes a GHCR continúa separado y solo se ejecuta
para releases o mediante `workflow_dispatch`.

`TELEGRAM_CHAT_ID` admite varios destinatarios separados por `|`, por ejemplo
`-1001234567890|-1009876543210`. Se envía el mismo aviso a cada chat.

Discord se configura preferentemente con los secrets `DISCORD_BOT_TOKEN` y
`DISCORD_CHANNEL_ID`. Este último admite varios canales separados por `|`, por
ejemplo `123456789012345678|987654321098765432`. Como alternativa se puede usar
`DISCORD_WEBHOOK_URL`, también con varios webhooks separados por `|`. Telegram y
Discord son opcionales: si faltan sus secrets, la publicación de la imagen no
falla.

## Backups

- Backup automático de PostgreSQL.
- Retención documentada.
- Cifrado en reposo y tránsito.
- Prueba periódica de restauración.
- Procedimiento de recuperación ante caída.

## Observabilidad

La aplicación expone logs JSON en stdout y `logs/aurea.log`, además de `/metrics` para Prometheus. Registrar disponibilidad, errores y latencia; excluir secretos y datos sensibles. Las métricas de negocio se agregarán cuando exista backend.

## Autodeployer opcional

En un host Linux con Docker, copiar `deploy/.env.example` a `../aurea-data/.env` y ejecutar `sudo scripts/deployment/install-autodeployer.sh`. El servicio consulta la imagen publicada cada cinco minutos y conserva el lock de despliegue. No es necesario para desarrollo ni para el hosting gestionado.

## Mantenimiento

Las migraciones deben ser reversibles o contar con un procedimiento de recuperación. Las dependencias se actualizan periódicamente y las integraciones externas se prueban en sandbox antes de cambiar producción.
