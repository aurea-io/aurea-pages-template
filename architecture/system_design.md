# Documentación de Diseño y Arquitectura: Plataforma AUREA

## 1. Visión General
La plataforma AUREA es un sistema integral multi-tenant (multi-empresa) diseñado para proporcionar soluciones tecnológicas adaptables a diversos rubros de negocio (restaurantes, estéticas, inmobiliarias, etc.). La arquitectura está concebida para ser altamente dinámica, basando la disponibilidad de características y módulos funcionales en configuraciones asignadas por sistema, en lugar de implementaciones rígidas en el código.

## 2. Arquitectura de Servicios

El sistema se compone de tres pilares fundamentales a nivel de interfaces de usuario y servicios:

### 2.1. BackOffice AUREA (Administración Global)
Es el panel de control central de uso exclusivo para los administradores de AUREA. Sus responsabilidades principales incluyen:
*   **Gestión de Clientes (Establecimientos):** Alta, baja y modificación de los negocios que utilizan el sistema.
*   **Asignación de Planes:** Configuración del plan contratado por cada establecimiento.
*   **Gestión de Funcionalidades:** Habilitación de funcionalidades base según el plan, así como la asignación de características extra o personalizadas a un cliente en particular.

### 2.2. BackOffice Cliente (Administración de Negocio)
Es la plataforma de gestión para los dueños y empleados de los establecimientos dados de alta. 
*   **Gestión Operativa:** Permite al cliente administrar su negocio (ej. configurar su menú, horarios, empleados, etc.).
*   **Acceso Restringido:** Las opciones y configuraciones disponibles en este panel están estrictamente limitadas por las funcionalidades que AUREA les haya habilitado previamente.

### 2.3. Frontend App (Aplicación para Clientes Finales)
Es la interfaz pública o aplicación (Super App) orientada a los consumidores finales.
*   **Multi-módulo Integrado:** Centraliza múltiples flujos de usuario (ej. realizar reservas, visualizar el menú, pedir delivery, acceder a redes sociales).
*   **Renderizado Dinámico:** La interfaz se adapta y muestra u oculta módulos en función de lo que el establecimiento en cuestión tiene configurado y habilitado.

---

## 3. Consideraciones Core de Diseño

### 3.1. Gestión de Acceso, Autorización y Multitenencia
El sistema de permisos y accesos opera en tres dimensiones clave:
*   **Multitenencia (Empresa / Establecimiento):** Toda la información está segmentada por establecimiento. Un usuario o entidad solo puede acceder a los datos que pertenecen a su propio "tenant" (empresa).
*   **Roles y Permisos:** Dentro de una misma empresa, el acceso se granulariza mediante roles (ej. Dueño de local, Empleado, Gerente), limitando las acciones que cada perfil puede realizar.
*   **Control por Plan Contratado:** A nivel macro, las características habilitadas para un "tenant" dependen del plan que han pagado. Si una empresa tiene un plan básico, las funcionalidades premium estarán bloqueadas o invisibles.

### 3.2. Configurabilidad mediante Componentes Dinámicos (Feature Flags)
*   **Arquitectura Basada en Booleanos:** La disponibilidad de cada componente o módulo (tanto en el Backoffice Cliente como en el Frontend App) se controla mediante banderas booleanas (feature flags).
*   **Reutilización Transversal:** Se desarrollarán componentes genéricos que puedan ser compartidos entre diferentes rubros, configurando su comportamiento de manera dinámica.

### 3.3. Agnosticismo de Rubro en el Código
*   **Regla de Negocio:** El código fuente (Front y Back) **no debe contener lógica condicional rígida basada en el tipo de rubro** (ej. evitar sentencias como `if (rubro === 'restaurante')`).
*   **Persistencia de Datos:** El "rubro" al que pertenece un establecimiento es un dato descriptivo persistido en la base de datos (una entidad o referencia).
*   **Comportamiento Dirigido por Configuración:** Las variaciones operativas entre una inmobiliaria y un restaurante no se resuelven validando el rubro, sino evaluando las configuraciones (booleanos) que el establecimiento tiene encendidas. (Ej. `if (establecimiento.hasDeliveryEnabled)` en lugar de `if (establecimiento.rubro === 'gastronomia')`).

### 3.4. Flujo de Activación
1. Un nuevo cliente contrata AUREA.
2. Desde el **BackOffice AUREA**, un administrador crea la entidad del establecimiento, asignándole un rubro como metadato.
3. Se le asigna un plan.
4. El sistema autocompleta las funcionalidades permitidas según el plan.
5. El administrador de AUREA puede encender/apagar funcionalidades extra manualmente (booleanos) en el perfil del cliente.
6. El cliente accede a su **BackOffice Cliente** y solo ve lo que tiene permitido, procediendo a configurar su negocio.
7. Los consumidores finales interactúan con el **Frontend App**, el cual se dibuja a partir de las configuraciones activas de ese negocio.
