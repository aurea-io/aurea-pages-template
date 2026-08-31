# Aurea Pages — POC v4

Esta rama contiene exclusivamente la propuesta actual de módulos dinámicos por empresa.

## Documentación

- [Especificación técnica](docs/tecnico/modulos-dinamicos.md)
- [POC y criterios de aceptación](docs/poc-modulos-dinamicos.md)
- [Decisiones y respuestas](docs/decisiones-modulos-dinamicos.md)
- [Mockup del backoffice](docs/assets/modulos-dinamicos-backoffice.png)
- [Mockup de Reservas y preview mobile](docs/assets/modulos-dinamicos-reservas.png)

## Idea central

```text
Sección → Página → Función
Servicios → Reservas → Subir foto a la reserva
```

La configuración se evalúa por tenant, suscripción/plan, rol y overrides de owner. El frontend recibe capabilities efectivas para renderizar la experiencia, pero el backend vuelve a autorizar cada operación sensible.

## Alcance de esta rama

- Modelo MongoDB.
- Catálogo global de módulos y funciones.
- Configuración por empresa.
- Evaluación de permisos y dependencias.
- Contratos de API.
- Integración conceptual con React.
- Diagramas Mermaid.
- Mockup visual del backoffice.
