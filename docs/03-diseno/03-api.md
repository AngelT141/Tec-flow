# Tec-flow — Diseño de API REST

**Base URL:** `/api` · **Formato:** JSON · **Auth:** cookie httpOnly con JWT.

## Convenciones

| Aspecto | Definición |
|---------|------------|
| Éxito | 200 (lectura/actualización), 201 (creación), 204 (sin contenido) |
| Error | `{ "error": { "code": "STRING_CODE", "message": "Texto legible" } }` |
| Errores comunes | 400 validación, 401 sin sesión, 403 rol insuficiente, 404 no encontrado, 409 conflicto |
| Filtros | Query string: `?status=OPEN&type=INCIDENT&priority=HIGH&assigneeId=…&q=texto` |
| Paginación | `?page=1&pageSize=20` → respuesta incluye `{ items, total, page, pageSize }` |
| Fechas | ISO 8601 UTC |

## 1. Autenticación (`/api/auth`)

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/auth/register` | Público | Registra usuario (rol siempre USER) |
| POST | `/auth/login` | Público | Devuelve cookie httpOnly; body: email, password |
| POST | `/auth/logout` | Auth | Elimina cookie de sesión |
| GET | `/auth/me` | Auth | Devuelve usuario actual (sin passwordHash) |

## 2. Tickets (`/api/tickets`)

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/tickets` | USER, AGENT, ADMIN | Crea ticket; devuelve `number` (TEC-xxxx) |
| GET | `/tickets` | USER: propios · AGENT/ADMIN: todos | Listado con filtros y paginación |
| GET | `/tickets/:id` | Participante* | Detalle completo |
| GET | `/tickets/:id/history` | Participante* | Historial de cambios y comentarios |
| POST | `/tickets/:id/comments` | Participante* | Agrega comentario |
| POST | `/tickets/:id/assign` | AGENT, ADMIN | Se asigna a sí mismo o reasigna (`assigneeId`) |
| POST | `/tickets/:id/resolve` | AGENT, ADMIN | Estado → RESOLVED; body: `resolutionNote` (obligatoria) |
| POST | `/tickets/:id/close` | USER (creador), ADMIN | Estado → CLOSED |
| POST | `/tickets/:id/reopen` | USER (creador), ADMIN | RESOLVED → IN_PROGRESS |
| POST | `/tickets/:id/cancel` | USER (creador), ADMIN | OPEN sin asignar → CANCELLED |

\* **Participante** = creador, agente asignado, cualquier agente (para atender) o administrador; según la regla RN-03/RN-04.

**Reglas aplicadas en servidor:** transiciones válidas (RN-05), cancelar solo OPEN sin asignar (RN-06), cerrar solo desde RESOLVED (RN-08), reabrir conserva agente (RN-09).

## 3. Categorías (`/api/categories`)

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/categories` | Auth | Lista activas (para formularios); admin ve todas |
| POST | `/categories` | ADMIN | Crea categoría |
| PATCH | `/categories/:id` | ADMIN | Editar nombre |
| PATCH | `/categories/:id/toggle` | ADMIN | Activa/desactiva (RN-11) |

## 4. Usuarios (`/api/users`) — solo ADMIN

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/users` | ADMIN | Listado (filtros: role, active, q) |
| POST | `/users` | ADMIN | Crea usuario con rol arbitrario |
| PATCH | `/users/:id` | ADMIN | Editar nombre, email, rol |
| PATCH | `/users/:id/toggle` | ADMIN | Activa/desactiva (bloquea desactivar propia cuenta: RN-10) |

## 5. Reportes (`/api/reports`)

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/reports/summary` | ADMIN | Totales por estado/tipo/prioridad; tiempo promedio de resolución; resueltos por periodo (`?from&to`) |
| GET | `/reports/agent/me` | AGENT, ADMIN | Métricas propias: asignados, pendientes, resueltos |

## 6. Notificaciones (`/api/notifications`) *(FR-21, prioridad baja)*

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/notifications` | Auth | Lista del usuario actual |
| PATCH | `/notifications/:id/read` | Auth | Marca como leída |

## Ejemplo de ciclo completo

```
POST /api/auth/login                 → cookie
POST /api/tickets                    → 201 { number: 1, code: "TEC-0001", … }
GET  /api/tickets?status=OPEN        → bandeja del agente
POST /api/tickets/1/assign           → IN_PROGRESS + historial
POST /api/tickets/1/resolve          → RESOLVED + resolutionNote
POST /api/tickets/1/close            → CLOSED (por el creador)
GET  /api/tickets/1/history          → trazabilidad completa
```
