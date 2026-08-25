# Módulo de turnos

## Objetivo

Permitir que un negocio publique servicios reservables y que un cliente elija una variante, fecha y horario, complete sus datos y reciba una confirmación.

## Configuración

- Categorías y orden de presentación.
- Servicios y variantes.
- Duración, precio y seña.
- Días, horarios, pausas y bloqueos.
- Anticipación mínima y ventana máxima de reserva.
- Política de cancelación y tolerancia.

## Flujo público

1. Abrir `/[slug]`.
2. Consultar información y condiciones.
3. Elegir categoría y variante.
4. Consultar fechas y horarios disponibles.
5. Completar datos.
6. Pagar o informar la seña según configuración.
7. Confirmar y obtener código de reserva.

## Flujo administrativo

Ver agenda diaria, semanal y mensual; filtrar por estado o servicio; confirmar, cancelar, reprogramar y marcar asistencia; crear turnos manuales; bloquear franjas y consultar historial.

## Disponibilidad

Se calcula cruzando horario de atención, excepciones, duración del servicio, reservas existentes, pausas y anticipación. La validación final debe repetirse al crear la reserva dentro de una transacción.

## Extensión de referencias visuales

La carga de fotos para uñas y servicios personalizados es una extensión prevista. Debe incluir límites de tamaño, tipos permitidos, autorización del cliente y política de eliminación.
