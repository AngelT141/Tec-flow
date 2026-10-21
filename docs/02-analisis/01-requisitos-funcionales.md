# Tec-flow — Requisitos Funcionales

Cada requisito tiene un identificador único (FR-xx) usado en diseño, pruebas y trazabilidad.

## Módulo: Autenticación y Usuarios

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-01 | El sistema debe permitir el registro de nuevos usuarios con nombre, correo, contraseña y rol por defecto "Usuario". | Alta |
| FR-02 | El sistema debe permitir el inicio y cierre de sesión. | Alta |
| FR-03 | El sistema debe recuperar acceso por correo electrónico (restablecer contraseña). | Baja |
| FR-04 | El administrador debe poder crear, editar, desactivar y reactivar usuarios, incluido su rol. | Alta |

## Módulo: Tickets

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-05 | Un usuario autenticado debe poder crear un ticket con: tipo (soporte, incidente, mantenimiento), asunto, descripción, categoría y prioridad. | Alta |
| FR-06 | El sistema debe mostrar al usuario únicamente sus propios tickets, con filtros por estado, tipo y prioridad. | Alta |
| FR-07 | El usuario debe poder agregar comentarios a sus tickets. | Alta |
| FR-08 | El usuario debe poder cancelar un ticket que aún no haya sido atendido. | Media |
| FR-09 | El agente debe poder consultar todos los tickets y filtrarlos por estado, tipo, prioridad, categoría y responsable. | Alta |
| FR-10 | El agente debe poder asignarse un ticket o reasignarlo a otro agente. | Alta |
| FR-11 | El agente debe poder cambiar el estado del ticket (En proceso → Resuelto). | Alta |
| FR-12 | El agente debe poder agregar comentarios visibles para el usuario. | Alta |
| FR-13 | El usuario debe poder confirmar la resolución (Cerrar) o reabrir un ticket resuelto. | Alta |
| FR-14 | Todo ticket debe conservar un historial completo de cambios (estado, asignación, comentarios) con fecha y autor. | Alta |
| FR-15 | El sistema debe asignar automáticamente un identificador consecutivo a cada ticket (formato TEC-0001). | Media |

## Módulo: Administración y Catálogos

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-16 | El administrador debe poder gestionar el catálogo de categorías (crear, editar, desactivar). | Media |
| FR-17 | El administrador debe poder gestionar el catálogo de tipos de ticket y prioridades del sistema. | Baja |

## Módulo: Reportes y Métricas

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-18 | El administrador debe poder ver el total de tickets por estado, tipo y prioridad. | Media |
| FR-19 | El administrador debe poder ver el tiempo promedio de resolución y los tickets resueltos en un periodo. | Media |
| FR-20 | El agente debe poder ver sus propias métricas (tickets asignados, resueltos, pendientes). | Baja |

## Módulo: Notificaciones internas

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| FR-21 | El sistema debe notificar al usuario cuando el estado de su ticket cambia (centro de notificaciones interno). | Baja |
