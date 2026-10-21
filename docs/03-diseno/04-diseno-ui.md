# Tec-flow — Diseño de Interfaz (UI)

## Paleta y estilo (propuesta)

| Elemento | Definición |
|----------|------------|
| Color primario | Azul `#2563eb` |
| Éxito / Resuelto | Verde `#16a34a` |
| Advertencia / En proceso | Ámbar `#d97706` |
| Error / Crítico | Rojo `#dc2626` |
| Neutros | Grises estándar |
| Tipografía | Inter o similar |
| Componentes | Estilo Tailwind UI (acorde al stack React+Vite) |

## Mapa de pantallas

| Ruta | Pantalla | Roles |
|------|----------|-------|
| `/login` | Iniciar sesión | Público |
| `/register` | Registro | Público |
| `/` | Redirige según rol | Auth |
| `/tickets` | Usuario: "Mis tickets" · Agente/Admin: bandeja global | Auth |
| `/tickets/new` | Formulario de nuevo ticket | USER |
| `/tickets/:id` | Detalle del ticket (estado, historial, comentarios) | Participantes |
| `/admin/users` | Gestión de usuarios | ADMIN |
| `/admin/categories` | Gestión de catálogos | ADMIN |
| `/admin/reports` | Reportes y métricas | ADMIN |
| `/metrics` | Métricas del agente | AGENT, ADMIN |

## Wireframes (texto)

### `/tickets` — Listado

```
┌──────────────────────────────────────────────┐
│  Tec-flow            [Usuario] [Cerrar sesión]│
├──────────────────────────────────────────────┤
│  [Buscar…] [Estado ▾] [Tipo ▾] [Prioridad ▾] │
│  [+ Nuevo ticket]                            │
├──────────────────────────────────────────────┤
│  TEC-0012  Falla de impresora  ALTA   Abierto│
│  TEC-0011  Error al iniciar…   MEDIA  En proc│
│  TEC-0009  Mantenimiento A/C   BAJA   Resuel.│
└──────────────────────────────────────────────┘
```

### `/tickets/:id` — Detalle

```
┌──────────────────────────────────────────────┐
│  TEC-0012 · Falla de impresora     [ALTA]    │
│  Estado: En proceso · Asignado: Juan Pérez   │
│  Tipo: Soporte · Categoría: Hardware         │
│  Creado: 2026-11-10 · Cerrado: —             │
├──────────────────────────────────────────────┤
│  Descripción del ticket…                     │
├──────────────────────────────────────────────┤
│  Historial / Comentarios                     │
│  • 10/11 10:02 Ana: creo ticket (Abierto)    │
│  • 10/11 10:15 Juan: se asignó (En proceso)  │
│  • 10/11 11:40 Juan: cambio de toner        │
├──────────────────────────────────────────────┤
│  [Escribir comentario…]        [Comentar]    │
│  [Resolver] [Reasignar]  (acciones rol)      │
└──────────────────────────────────────────────┘
```

## Estados de badge (consistente en todo el sistema)

| Estado | Color |
|--------|-------|
| Abierto | Gris/azul |
| En proceso | Ámbar |
| Resuelto | Verde |
| Cerrado | Gris oscuro |
| Cancelado | Rojo suave |

## Reglas de UX

1. **Máx. 3 pasos para crear ticket:** "Nuevo ticket" → formulario → confirmación con TEC-xxxx (NFR-08).
2. Filtros visibles en el listado; se reflejan en la URL (compartible).
3. Acciones del ticket según rol: el usuario ve Cerrar/Reabrir/Cancelar; el agente ve Asignar/Resolver; el admin ve ambas.
4. Formularios con validación en línea y mensajes en español.
5. Responsive: listado en tarjetas en móvil (< 768 px), tabla en escritorio (NFR-09).
6. Estados vacíos con mensaje y llamado a la acción ("No hay tickets con estos filtros").

## Componentes reutilizables

- `TicketCard` / `TicketTable` — listado
- `StatusBadge`, `PriorityBadge`, `TypeBadge`
- `CommentThread` — historial con comentarios
- `FilterBar`
- `Modal` (confirmaciones: cancelar, reasignar)
- `Layout` con navegación por rol
