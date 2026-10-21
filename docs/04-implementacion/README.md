# Fase 4: Implementación

## Objetivo

Construir el sistema Tec-flow conforme al diseño aprobado.

## Estado: 🚧 En progreso

## Avance

### ✅ Completado (incremento 1)

- **Monorepo** `client/` + `server/` según `docs/03-diseno/06-estructura-codigo.md`.
- **Esquema Prisma** completo (6 entidades, 4 enums) con índices y mapeo a tablas snake_case.
- **API Express** con ESM: helmet, CORS restringido, cookie-parser, rate limiting en login (10 intentos / 15 min).
- **Módulo de autenticación:** `register`, `login`, `logout`, `me` con JWT en cookie httpOnly (8 h) y bcrypt.
- **Middlewares:** `requireAuth`, `requireRole`, `errorHandler` con formato `{ error: { code, message } }`.
- **Cliente React + Vite:** Login, Registro, Navbar, Layout, `RutaProtegida`, `AuthContext`, cliente `fetch` con proxy a `/api`.
- **Seed:** usuarios admin/agente/usuario, 4 categorías y contador TEC-xxxx.
- **Verificado:** build del cliente OK, API arranca y `/api/health` + 401 correcto en `/api/auth/me`.

### ✅ Completado (incremento 2 — módulo de tickets)

- **API de tickets:** listado con filtros/paginación y alcance por rol (RN-03), creación con numeración TEC-xxxx en transacción (RN-02), detalle, historial, comentarios.
- **Acciones con reglas de negocio:** `assign` (AGENT/ADMIN), `resolve` con nota obligatoria, `close`/`reopen` (creador o ADMIN), `cancel` (solo OPEN sin asignar; RN-05 a RN-09).
- **Historial completo:** cada transición, asignación y comentario genera `HistoryEntry` (RN-12).
- **Auto-cierre por inactividad:** tickets RESOLVED con más de 7 días se cierran al consultarlos (RN-15).
- **Categorías:** `GET /api/categories` (activas para usuarios, todas para admin).
- **Cliente:** páginas de listado con filtros, creación de ticket y detalle con acciones por rol, comentarios e historial; badges de estado/prioridad/tipo.
- **Verificado:** build del cliente OK; endpoints sin sesión responden 401; rutas montadas en `app.js`.

### ✅ Completado (incremento 3 — administración y reportes)

- **Usuarios (ADMIN):** listado con filtros y paginación, creación con rol, edición y activación/desactivación con bloqueo de la propia cuenta (RN-10).
- **Categorías (ADMIN):** creación, renombrado y desactivación lógica (RN-11).
- **Reportes (ADMIN):** totales por estado/tipo/prioridad, cerrados en el periodo y tiempo promedio de resolución, con filtro por fechas.
- **Métricas del agente:** asignados, pendientes, resueltos y tiempo promedio (FR-20).
- **UI:** páginas `/admin/users`, `/admin/categories`, `/admin/reports` y `/metrics`; navegación por rol en la barra superior; guard de rutas por rol.
- **Verificado:** build del cliente OK; endpoints nuevos montados y protegidos (401 sin sesión).

### ⏳ Pendiente (incrementos siguientes)

1. Notificaciones internas (FR-21, prioridad baja).
2. Pruebas (plan, casos, ejecución) y corrección de defectos.
3. Despliegue y manual de usuario.

## Cómo ejecutar en local

Requisitos: Node.js 18+ y acceso a la base (Supabase o PostgreSQL local).

### Servidor

```bash
cd server
npm install
npx prisma migrate deploy    # aplica las migraciones (Supabase o local)
npm run seed                 # datos iniciales
npm run dev                  # API en http://localhost:4000
```

### Base de datos

Se usa **Supabase** mediante la cadena **Session pooler** (IPv4), porque la conexión directa (`db.<ref>.supabase.co`) es solo IPv6. Alternativa local: PostgreSQL via Homebrew con la base `tecflow_dev` (dejar la URL local comentada en `server/.env`).

### Seguridad de la base (Supabase Advisors)

La migración `20261022010000_harden_public_tables` resuelve los avisos del *Security Advisor*:

- **RLS habilitado** en las 7 tablas públicas (`users`, `categories`, `tickets`, `comments`, `history_entries`, `counters`, `_prisma_migrations`). La API entra como rol `postgres`, que tiene `BYPASSRLS`, por lo que Prisma sigue operando igual.
- **Permisos revocados** a `anon` y `authenticated`: la app no usa PostgREST, así que nadie puede leer/escribir con la anon key.
- **Índices añadidos** para las FKs sin índice (`comments.authorId`, `history_entries.actorId`), que resuelve los avisos del *Performance Advisor*.

### Cliente

```bash
cd client
npm install
npm run dev                  # web en http://localhost:5173 (proxy a /api)
```

### Usuarios sembrados

| Rol | Email | Contraseña |
|-----|-------|------------|
| ADMIN | admin@tecflow.com | Admin1234! |
| AGENT | agente@tecflow.com | Agente1234! |
| USER | usuario@tecflow.com | Usuario1234! |

## Pruebas end-to-end ejecutadas (21 oct 2026)

| Escenario | Resultado |
|-----------|-----------|
| Login de los 3 roles | ✅ |
| Crear ticket → TEC-0001 en estado OPEN | ✅ |
| Listado del usuario (solo propios) y filtros | ✅ |
| Asignación por agente → IN_PROGRESS | ✅ |
| Comentario del agente | ✅ |
| Resolver con nota → RESOLVED | ✅ |
| Reabrir por el creador → IN_PROGRESS | ✅ |
| Resolver de nuevo y cerrar → CLOSED | ✅ |
| Historial completo (8 eventos en orden) | ✅ |
| Admin: listado de usuarios, reportes, alta de usuario | ✅ |
| Auto-desactivación de cuenta (bloqueada) | ✅ |
| Usuario intenta resolver / ver reportes (403) | ✅ |
| Cancelar ticket no abierto (400) | ✅ |

## Notas técnicas

- Se usó **Prisma 6.x** (estable) porque la versión 8 RC cambia el CLI por completo.
- Express 5: `req.query` es de solo lectura; los esquemas de query se guardan en `req.validatedQuery`.
- Migración inicial versionada en `server/prisma/migrations/`.
- El archivo `server/.env` es local y no se versiona (contiene secretos).
