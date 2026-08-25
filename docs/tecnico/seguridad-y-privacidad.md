# Seguridad y privacidad

## Identidad y acceso

- Hash de contraseñas con algoritmo moderno y costo configurado.
- Sesiones revocables y expiración adecuada.
- MFA para administradores cuando la operación lo permita.
- Roles mínimos: `platform_admin`, `tenant_admin`, `operator` y `customer` opcional.
- Verificación de autorización en cada operación sensible.

## Aislamiento de datos

El `tenantId` debe derivarse del contexto autenticado o del recurso público validado, nunca confiarse ciegamente al body enviado por el cliente. Las pruebas deben intentar acceder a recursos pertenecientes a otro tenant.

## Datos personales

El POC puede tratar nombre, teléfono, correo, historial de reservas y comprobantes. Antes de producción se debe definir finalidad, consentimiento, retención, exportación, control de acceso interno y procedimiento ante incidentes.

## Pagos

- No almacenar datos completos de tarjetas.
- Usar checkout o tokenización del proveedor.
- Validar firma y autenticidad de webhooks.
- Aplicar idempotencia.
- Separar pago aprobado de reserva confirmada hasta cumplir la política del negocio.

## Seguridad operacional

- HTTPS en todos los ambientes compartidos.
- Headers de seguridad y CORS restrictivo.
- Rate limiting en endpoints públicos.
- Validación de payloads y límites de tamaño.
- Logs sin contraseñas, tokens ni datos financieros sensibles.
- Backups cifrados y pruebas periódicas de restauración.
