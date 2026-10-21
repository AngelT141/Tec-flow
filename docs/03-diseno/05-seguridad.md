# Tec-flow — Diseño de Seguridad y Autenticación

## Autenticación

| Aspecto | Decisión |
|---------|----------|
| Mecanismo | JWT firmado (HS256) con expiración de 8 horas |
| Entrega del token | Cookie **httpOnly**, `sameSite=Lax`, `secure` en producción |
| Hash de contraseñas | bcrypt con salt rounds = 10 |
| Cierre de sesión | Eliminación de la cookie en servidor |

## Autorización

Middleware en Express, encadenados por ruta:

```
requireAuth → requireRole("AGENT", "ADMIN") → controlador
```

| Rol | Alcance |
|-----|---------|
| USER | CRUD limitado a tickets propios (RN-03) |
| AGENT | Tickets globales + acciones de atención |
| ADMIN | Hereda AGENT + usuarios, catálogos, reportes |

La autorización se evalúa **siempre en servidor** (NFR-02); el frontend solo oculta botones como ayuda visual.

## Validación de entrada

- **Zod** en cada endpoint: longitudes, enums, formatos de email, IDs.
- Queries de listado acotadas (valores de enum conocidos, pageSize máximo 100).
- Contenido de comentarios: texto plano, se escapa al renderizar en React (no `dangerouslySetInnerHTML`).

## Protecciones transversales

| Medida | Implementación |
|--------|----------------|
| CORS | Restringido al origen del frontend en producción |
| Helmet | Cabeceras HTTP seguras en Express |
| Rate limiting | Login: máximo 10 intentos / 15 min por IP |
| Errores | Mensajes genéricos en login (no revelar si el email existe) |
| Logs | Sin contraseñas ni tokens en logs |

## Control de acceso a datos

- **Listado de tickets:** el filtro de pertenencia (creatorId = usuario actual para USER) se aplica **en la consulta del servidor**, nunca confiando en parámetros del cliente.
- **Detalle y acciones:** el servidor verifica participación/rol antes de cada operación.
- **Respuestas:** `passwordHash` jamás se serializa (select explícito en Prisma).

## Auditoría

- Todo cambio de estado, asignación, prioridad o comentario genera `HistoryEntry` (RN-12) con actor y timestamp.
- El auto-cierre por inactividad (RN-15) se registra con `action: auto_closed` y actor del sistema.

## Checklist de entrega (fase de pruebas)

- [ ] Intento de acceso a ticket ajeno como USER → 403/404.
- [ ] USER intenta resolver ticket → 403.
- [ ] Contraseña no aparece en ninguna respuesta de API.
- [ ] Cookie no legible desde JavaScript.
- [ ] Login con fuerza bruta limitado.
- [ ] IDs no consecutivos adivinables para UUIDs (users, comments).
