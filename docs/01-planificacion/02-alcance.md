# Tec-flow — Alcance del Proyecto

## Dentro del alcance (In)

### Funcionalidades

| # | Funcionalidad | Prioridad |
|---|---------------|-----------|
| F1 | Registro e inicio de sesión de usuarios | Alta |
| F2 | Gestión de roles (Usuario, Agente, Administrador) | Alta |
| F3 | Creación de tickets (soporte, incidente, mantenimiento) con categoría, prioridad y descripción | Alta |
| F4 | Listado y filtrado de tickets (estado, tipo, prioridad, responsable) | Alta |
| F5 | Asignación y cambio de estado del ticket por agentes | Alta |
| F6 | Historial/comentarios por ticket (trazabilidad) | Alta |
| F7 | Panel de administración (gestión de usuarios y catálogos) | Media |
| F8 | Métricas y reportes básicos (resueltos, pendientes, tiempo promedio) | Media |
| F9 | Notificaciones internas (cambios de estado visibles en el sistema) | Baja |
| F10 | Manual de usuario y documentación técnica | Alta |

### Tipos de ticket

1. **Soporte técnico / Helpdesk** — solicitudes de ayuda con sistemas o equipos.
2. **Incidentes / Bug tracking** — reporte de fallas o errores.
3. **Mantenimiento físico** — solicitud de mantenimiento a equipos o instalaciones.

### Roles

| Rol | Capacidad principal |
|-----|---------------------|
| Usuario | Crear tickets, ver sus tickets, comentar |
| Agente | Atender cualquier ticket, asignar, cambiar estado, cerrar |
| Administrador | Todo lo anterior + gestionar usuarios y catálogos + ver reportes globales |

## Fuera del alcance (Out)

- Aplicación móvil nativa (solo web, adaptable a móvil vía navegador).
- Sistema multi-empresa / multi-tenant.
- Integración con correo electrónico, SMS o mensajería externa.
- Facturación o cobro por tickets.
- SLA contractuales ni sanciones por incumplimiento.
- Chat en tiempo real entre usuario y agente.
- IA o clasificación automática de tickets.

## Restricciones

- Duración: ~1 mes.
- Proyecto académico: se asume infraestructura de bajo costo (ver `05-recursos.md`).
- Equipo pequeño; alcance protegido: cualquier cambio de alcance debe aprobarse formalmente.

## Criterios de aceptación del proyecto

1. Los tres roles pueden autenticarse y ven solo las funciones de su rol.
2. Un usuario puede crear un ticket y ver su evolución hasta el cierre.
3. Un agente puede atender y cerrar tickets con historial completo.
4. El administrador puede gestionar usuarios y consultar métricas.
5. Pruebas aprobadas sin defectos críticos (ver fase de pruebas).
6. Sistema desplegado y accesible en un entorno web.
