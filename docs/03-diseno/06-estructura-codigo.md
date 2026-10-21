# Tec-flow — Estructura del Código

Monorepo con dos aplicaciones y la documentación:

```
Tec-flow/
├── README.md
├── .gitignore
├── docs/                        # documentación por fases (ya existente)
├── client/                      # React + Vite
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx             # punto de entrada
│       ├── App.jsx              # router principal
│       ├── api/
│       │   └── client.js        # fetch wrapper (credentials: include)
│       ├── components/
│       │   ├── layout/          # Layout, Navbar, RutaProtegida
│       │   ├── tickets/         # TicketCard, TicketTable, FilterBar, StatusBadge…
│       │   └── ui/              # Button, Input, Modal, Spinner
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Tickets.jsx
│       │   ├── TicketDetail.jsx
│       │   ├── NewTicket.jsx
│       │   ├── admin/Users.jsx
│       │   ├── admin/Categories.jsx
│       │   ├── admin/Reports.jsx
│       │   └── agent/Metrics.jsx
│       ├── context/
│       │   └── AuthContext.jsx  # usuario actual, login/logout
│       └── hooks/               # useTickets, useAuth…
└── server/                      # Express + Prisma
    ├── package.json
    ├── .env.example             # DATABASE_URL, JWT_SECRET, CLIENT_URL
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js              # admin inicial, categorías, tickets demo
    └── src/
        ├── index.js             # arranque del servidor
        ├── app.js               # Express: middleware global y rutas
        ├── config/
        │   └── env.js           # variables de entorno validadas
        ├── middleware/
        │   ├── requireAuth.js
        │   ├── requireRole.js
        │   ├── errorHandler.js  # formato { error: { code, message } }
        │   └── validate.js      # middleware Zod
        ├── modules/
        │   ├── auth/            # routes, controller, service
        │   ├── tickets/
        │   ├── users/
        │   ├── categories/
        │   ├── reports/
        │   └── notifications/
        └── lib/
            ├── prisma.js        # cliente Prisma singleton
            └── jwt.js           # firmar/verificar, cookies
```

## Convenciones

| Tema | Convención |
|------|------------|
| Módulos | Cada dominio agrupa `routes` + `controller` + `service` (lógica de negocio RN) |
| Nombres | Archivos camelCase; componentes React PascalCase |
| PRs/commits | Mensajes en español, imperativo: "Agregar listado de tickets" |
| Env | `.env` nunca se commitea; `.env.example` documenta variables |
| Prisma | Migraciones con `prisma migrate`; seed reproducible |
| Scripts mínimos | `server`: dev (nodemon), start, migrate, seed · `client`: dev, build |

## Orden de implementación (fase 4)

1. Esqueleto: ambos `package.json`, Express mínimo, Vite mínimo, Prisma schema + migración inicial.
2. Auth (login/register/me) + middleware.
3. Tickets: crear, listar, detalle, historial, comentarios.
4. Acciones del ticket: assign, resolve, close, reopen, cancel.
5. Users y Categories (admin).
6. Reports + panel de métricas.
7. Notificaciones (baja prioridad) y pulido UI.
