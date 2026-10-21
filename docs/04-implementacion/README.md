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

### ⏳ Pendiente (incrementos siguientes)

1. Módulo de usuarios y categorías (CRUD admin).
2. Reportes y panel de métricas.
3. Notificaciones internas.
4. Pruebas automatizadas y pulido de UI.

## Cómo ejecutar en local

Requisitos: Node.js 18+, base PostgreSQL (Supabase).

### Servidor

```bash
cd server
cp .env.example .env      # completar DATABASE_URL (Supabase) y JWT_SECRET
npm install
npx prisma migrate dev    # crea las tablas
npm run seed              # datos iniciales
npm run dev               # API en http://localhost:4000
```

### Cliente

```bash
cd client
npm install
npm run dev               # web en http://localhost:5173 (proxy a /api)
```

### Usuarios sembrados

| Rol | Email | Contraseña |
|-----|-------|------------|
| ADMIN | admin@tecflow.com | Admin1234! |
| AGENT | agente@tecflow.com | Agente1234! |
| USER | usuario@tecflow.com | Usuario1234! |

## Notas técnicas

- Se usó **Prisma 6.x** (estable) porque la versión 8 RC cambia el CLI por completo.
- La migración y el seed requieren una `DATABASE_URL` real de Supabase en `server/.env` (archivo local, no versionado).
