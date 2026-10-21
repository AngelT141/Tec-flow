# Tec-flow — Arquitectura General

## Stack tecnológico (decidido)

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite |
| Backend | Node.js + Express (API REST) |
| ORM | Prisma |
| Base de datos | PostgreSQL (Supabase) |
| Autenticación | JWT (cookie httpOnly) + bcrypt |

## Arquitectura de 3 capas

```
┌────────────────────┐
│  Cliente React     │  Presentación: componentes, rutas, estado
│  (Vite)            │
└─────────┬──────────┘
          │  HTTP/JSON (fetch)
┌─────────▼──────────┐
│  API Express       │  Lógica de negocio, validación,
│                    │  autorización por rol
└─────────┬──────────┘
          │  Prisma Client
┌─────────▼──────────┐
│  PostgreSQL        │  Persistencia (Supabase)
│  (Supabase)        │
└────────────────────┘
```

## Principios de diseño

1. **Separación de responsabilidades:** la interfaz no conoce reglas de negocio; el API no sabe de estilos.
2. **Autorización en el servidor:** todo endpoint protegido valida sesión y rol (NFR-02).
3. **API REST stateless:** operaciones CRUD con verbos HTTP y códigos de estado estándar.
4. **Validación en ambos extremos:** formularios validan para UX; el API valida siempre (NFR-04).
5. **Trazabilidad:** cada transición crítica genera registro de historial (RN-12).

## Flujo transversal de una petición

1. React envía `fetch` con cookie de sesión.
2. Express ejecuta middleware: CORS → cookies/JWT → `requireAuth` → `requireRole` (si aplica) → validación (Zod).
3. Controlador invoca la lógica de negocio (reglas RN-01…RN-15).
4. Prisma persiste en PostgreSQL dentro de transacción cuando hay múltiples escrituras (p. ej. cambiar estado + crear historial).
5. Respuesta JSON al cliente; errores con formato `{ error: { code, message } }`.

## Decisiones clave

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| Cookie httpOnly para JWT | Sí | Mitiga robo de token por XSS (NFR-03). |
| Validación con Zod en el API | Sí | Tipado y mensajes consistentes. |
| Transacciones Prisma | Sí | Estado + historial siempre consistentes (NFR-10). |
| Numeración TEC-xxxx | Tabla `Counter` | Consecutivo sin huecos, portable (ver modelo de datos). |
| Auto-cierre por inactividad (RN-15) | Tarea al consultar + script programado opcional | Simple para el alcance académico. |

## Entornos

| Entorno | Uso | Backend | Frontend |
|---------|-----|---------|----------|
| Desarrollo | Trabajo diario | Express local + Supabase (o Postgres local) | Vite dev server |
| Producción | Demo/entrega | Node en proveedor (Railway/Render) | Build estático (Vercel o servido por Express) |
