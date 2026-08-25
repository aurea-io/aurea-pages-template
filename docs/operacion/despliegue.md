# Despliegue y operación

## Ambientes

Se recomienda separar desarrollo, staging y producción. Cada ambiente debe tener base de datos, secretos, URLs y proveedores de pago independientes.

## Pipeline

1. Instalar dependencias reproduciblemente.
2. Ejecutar formato y lint.
3. Verificar tipos.
4. Ejecutar unitarias e integración.
5. Construir API y frontend.
6. Ejecutar migraciones de manera controlada.
7. Publicar artefactos.
8. Ejecutar smoke tests.

## Backups

- Backup automático de PostgreSQL.
- Retención documentada.
- Cifrado en reposo y tránsito.
- Prueba periódica de restauración.
- Procedimiento de recuperación ante caída.

## Observabilidad

Registrar métricas de disponibilidad, errores, latencia, reservas creadas, pagos fallidos y webhooks rechazados. Los logs deben incluir un identificador de correlación y excluir secretos y datos sensibles.

## Mantenimiento

Las migraciones deben ser reversibles o contar con un procedimiento de recuperación. Las dependencias se actualizan periódicamente y las integraciones externas se prueban en sandbox antes de cambiar producción.
