# Despliegue y operación

## Ambientes

Se recomienda separar desarrollo, staging y producción. Cada ambiente debe tener base de datos, secretos, URLs y proveedores de pago independientes.

## Pipeline

1. Instalar Node.js 22 y validar con `npm install`, `npm run check` y `npm test`.
2. Construir la imagen Docker como usuario no root.
3. Publicar la imagen en GHCR al crear un release.
4. Ejecutar el healthcheck y, opcionalmente, el autodeployer local.
5. Avisar el resultado por Telegram si están configurados `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`.

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
