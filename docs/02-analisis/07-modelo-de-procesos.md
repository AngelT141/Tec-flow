# Tec-flow — Modelado de Procesos

## 1. Ciclo de vida del ticket (estados)

```mermaid
stateDiagram-v2
    [*] --> Abierto : usuario crea ticket (HU-02)
    Abierto --> En_proceso : agente se asigna (HU-06)
    Abierto --> Cancelado : usuario cancela (HU-08)
    En_proceso --> Resuelto : agente resuelve (HU-06)
    Resuelto --> Cerrado : usuario confirma cierre (HU-07)
    Resuelto --> En_proceso : usuario reabre (HU-07)
    Resuelto --> Cerrado : auto-cierre por inactividad (RN-15)
    Cerrado --> [*]
    Cancelado --> [*]
```

## 2. Flujo principal: creación y atención de un ticket

```mermaid
flowchart TD
    A[Usuario inicia sesión] --> B[Crear ticket]
    B --> C[Ticket Abierto - TEC-xxxx]
    C --> D{Agente en bandeja}
    D --> E[Agente se asigna - En proceso]
    E --> F[Agente comenta avances]
    F --> G[Agente marca Resuelto]
    G --> H{Usuario evalúa solución}
    H -- Solucionado --> I[Cerrado]
    H -- No resuelto --> E
    C -- Sin agente --> J[Usuario cancela]
    J --> K[Cancelado]
    G -- Sin respuesta 7 días --> I
```

## 3. Flujo de autenticación y autorización

```mermaid
flowchart TD
    A[Acceso al sistema] --> B{Cuenta activa?}
    B -- No --> C[Mensaje de cuenta bloqueada]
    B -- Sí --> D{Rol}
    D -- Usuario --> E[Panel: Mis tickets / Nuevo ticket]
    D -- Agente --> F[Panel: Bandeja global / Mis métricas]
    D -- Administrador --> G[Panel: Bandeja + Usuarios + Catálogos + Reportes]
```

## 4. Proceso administrativo de usuarios

```mermaid
flowchart LR
    A[Admin: Usuarios] --> B{Acción}
    B -- Crear --> C[Alta con rol]
    B -- Editar --> D[Actualizar datos]
    B -- Desactivar --> E[Bloqueo de acceso - RN-14]
    B -- Reactivar --> F[Restaura acceso]
    C & D & E & F --> G[Registro en auditoría/historial]
```

## Notas de modelado

- Los diagramas usan notación Mermaid y se visualizan en GitHub.
- Las transiciones respetan las reglas RN-05 a RN-09 de `06-reglas-de-negocio.md`.
- El estado **Resuelto → Cerrado** por inactividad (RN-15) puede implementarse como tarea programada o al consultar el ticket; la decisión se toma en la fase de diseño.
