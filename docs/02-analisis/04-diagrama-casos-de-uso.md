# Tec-flow — Diagrama de Casos de Uso

```mermaid
usecaseDiagram
    actor "Invitado" as Inv
    actor "Usuario" as U
    actor "Agente" as A
    actor "Administrador" as Adm

    package "Autenticación" {
        usecase "Registrarse" as UC02
        usecase "Iniciar sesión" as UC01
    }

    package "Usuario" {
        usecase "Crear ticket" as UC03
        usecase "Consultar mis tickets" as UC04
        usecase "Comentar en ticket" as UC05U
        usecase "Cancelar ticket" as UC06
        usecase "Cerrar o reabrir ticket" as UC08
    }

    package "Agente" {
        usecase "Atender ticket" as UC07
        usecase "Comentar en ticket (agente)" as UC05A
        usecase "Ver mis métricas" as UC12
    }

    package "Administración" {
        usecase "Gestionar usuarios" as UC09
        usecase "Gestionar catálogos" as UC10
        usecase "Ver reportes" as UC11
        usecase "Atender ticket (admin)" as UC07Adm
    }

    Inv --> UC02
    Inv --> UC01
    U --> UC01
    A --> UC01
    Adm --> UC01

    U --> UC03
    U --> UC04
    U --> UC05U
    U --> UC06
    U --> UC08

    A --> UC07
    A --> UC05A
    A --> UC12

    Adm --> UC09
    Adm --> UC10
    Adm --> UC11
    Adm --> UC07Adm

    UC07 ..|> UC07Adm : hereda
    UC05A ..|> UC05U : hereda
```

## Leyenda de relaciones

- **Herencia (`..|>`):** el Administrador hereda las capacidades de Atender ticket y Comentar; en el sistema se implementa como que el rol Administrador cumple también funciones de Agente.
