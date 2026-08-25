# Configuración

## Variables de entorno esperadas

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=
PUBLIC_APP_URL=http://localhost:5173
API_URL=http://localhost:3000
SESSION_SECRET=
PAYMENT_PROVIDER=mercadopago
PAYMENT_ACCESS_TOKEN=
PAYMENT_WEBHOOK_SECRET=
MAIL_PROVIDER=
MAIL_API_KEY=
STORAGE_BUCKET=
```

Los nombres son una referencia. No deben copiarse secretos reales al repositorio ni a ejemplos públicos.

## Configuración por tenant

- slug y nombre público;
- logo, colores y textos;
- zona horaria y moneda;
- horarios y excepciones;
- servicios, variantes y precios;
- seña y política de cancelación;
- módulos habilitados;
- canales de notificación.

## Ambientes

- `development`: datos locales y proveedores sandbox.
- `test`: base aislada y datos deterministas.
- `staging`: réplica operativa sin datos productivos sensibles.
- `production`: secretos gestionados, HTTPS, backups y monitoreo.
