# Fase 3: Diseño

## Objetivo

Diseñar la arquitectura y los componentes del sistema Tec-flow a partir de los requisitos aprobados.

## Estado: ✅ Completada (20 de octubre de 2026)

## Stack decidido

React + Vite → Express (API REST) → Prisma ORM → PostgreSQL (Supabase)

## Documentos

| # | Documento | Archivo |
|---|-----------|---------|
| 1 | Arquitectura general y decisiones clave | [01-arquitectura.md](01-arquitectura.md) |
| 2 | Modelo de datos (ER, entidades, numeración) | [02-modelo-de-datos.md](02-modelo-de-datos.md) |
| 3 | Diseño de API REST | [03-api.md](03-api.md) |
| 4 | Diseño de interfaz (wireframes y UX) | [04-diseno-ui.md](04-diseno-ui.md) |
| 5 | Seguridad y autenticación | [05-seguridad.md](05-seguridad.md) |
| 6 | Estructura del código y convenciones | [06-estructura-codigo.md](06-estructura-codigo.md) |

## Resumen

- Arquitectura de 3 capas con autorización siempre en servidor.
- 6 entidades: User, Category, Ticket, Comment, HistoryEntry, Counter.
- Numeración TEC-xxxx sin huecos mediante tabla Counter en transacción.
- ~30 endpoints REST documentados con roles y reglas.
- 10 rutas de interfaz con wireframes y estados de badge.

## Pendiente

- Aprobación del docente para pasar a la Fase 4 (Implementación).
