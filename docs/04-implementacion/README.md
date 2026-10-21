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

### ⏳ Pendiente (incrementos siguientes)

1. Módulo de tickets (crear, listar, detalle, historial, comentarios, acciones).
2. Módulo de usuarios y categorías (admin).
3. Reportes y panel de métricas.
4. Notificaciones internas.
5. Pulido de UI (badges, filtros, responsive completo).

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
