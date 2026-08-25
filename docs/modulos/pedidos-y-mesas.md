# Módulo de pedidos y mesas

## Objetivo posterior

Extender la plataforma a locales gastronómicos mediante un menú accesible por QR/NFC, pedidos desde la mesa y seguimiento del consumo.

## Funciones previstas

- Menú público por negocio.
- Productos, variantes, extras y disponibilidad.
- Código de mesa mediante QR o NFC.
- Sesión de mesa.
- Participantes identificados por nombre.
- Pedido asociado a mesa y participante.
- Agrupación y división de cuenta.
- Ticket separado por persona.
- Pago online opcional.

## Dependencias

Requiere catálogo, clientes opcionales, pagos y notificaciones. No debe reutilizar estados de reserva como si fueran estados de pedido; ambos dominios deben mantener su propio ciclo de vida.
