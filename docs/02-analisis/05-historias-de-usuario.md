# Tec-flow — Historias de Usuario

Formato: **Como** [rol], **quiero** [objetivo], **para** [beneficio]. Cada historia incluye criterios de aceptación (CA).

---

## HU-01 — Registro e inicio de sesión *(Alta)*

**Como** visitante, **quiero** registrarme e iniciar sesión, **para** acceder al sistema de forma personalizada.

- CA1: Registro valida correo válido, contraseña mínima de 8 caracteres y campos obligatorios.
- CA2: Con credenciales correctas, el usuario llega al panel de su rol.
- CA3: Con credenciales incorrectas se muestra error genérico.

## HU-02 — Crear ticket *(Alta)*

**Como** usuario, **quiero** crear un ticket con tipo, asunto, descripción, categoría y prioridad, **para** solicitar atención técnica.

- CA1: El formulario solo acepta tipos y categorías del catálogo activo.
- CA2: Al enviar, el sistema muestra el número TEC-xxxx asignado.
- CA3: El ticket queda en estado "Abierto" y aparece en "Mis tickets".

## HU-03 — Dar seguimiento a mis tickets *(Alta)*

**Como** usuario, **quiero** ver el estado y historial de mis tickets, **para** saber cómo avanza mi solicitud.

- CA1: El listado permite filtrar por estado, tipo y prioridad.
- CA2: El detalle muestra historial completo con fechas y autor.
- CA3: No se muestran tickets de otros usuarios.

## HU-04 — Comentar en un ticket *(Alta)*

**Como** usuario, **quiero** agregar comentarios a mi ticket, **para** aportar información adicional.

- CA1: El comentario queda en el historial con fecha y autor.
- CA2: Solo participantes del ticket (creador, agentes, admin) ven los comentarios.

## HU-05 — Bandeja de tickets del agente *(Alta)*

**Como** agente, **quiero** ver y filtrar todos los tickets, **para** identificar pendientes y priorizar el trabajo.

- CA1: Filtros por estado, tipo, prioridad, categoría y responsable.
- CA2: Los tickets Abiertos sin asignar se destacan en la bandeja.

## HU-06 — Atender y resolver ticket *(Alta)*

**Como** agente, **quiero** asignarme un ticket, comentar avances y marcarlo resuelto, **para** gestionar la atención.

- CA1: Al asignarse, el ticket pasa a "En proceso" y queda registrado en el historial.
- CA2: Al marcar "Resolver" se solicita nota de resolución.
- CA3: El usuario recibe notificación interna del cambio a "Resuelto".

## HU-07 — Cerrar o reabrir ticket *(Alta)*

**Como** usuario, **quiero** confirmar la solución o reabrir mi ticket, **para** cerrar el ciclo o pedir revisión.

- CA1: Cerrado el ticket, no admite más comentarios.
- CA2: Reabierto, el ticket vuelve a "En proceso" con su asignación actual.

## HU-08 — Cancelar ticket *(Media)*

**Como** usuario, **quiero** cancelar mi ticket aún no atendido, **para** retirar una solicitud que ya no necesito.

- CA1: Solo se pueden cancelar tickets Abiertos y sin agente.
- CA2: Requiere confirmación antes de cancelar.

## HU-09 — Administrar usuarios *(Alta)*

**Como** administrador, **quiero** crear, editar, desactivar usuarios y cambiar roles, **para** controlar el acceso al sistema.

- CA1: No es posible desactivar la propia cuenta del administrador.
- CA2: Los cambios de rol surten efecto en el siguiente inicio de sesión.

## HU-10 — Administrar catálogos *(Media)*

**Como** administrador, **quiero** gestionar categorías, **para** mantener los tickets bien clasificados.

- CA1: Las categorías desactivadas no aparecen en formularios nuevos, pero sí en tickets históricos.

## HU-11 — Reportes y métricas *(Media)*

**Como** administrador, **quiero** ver métricas de tickets por estado, tipo, prioridad y periodo, **para** evaluar el desempeño del soporte.

- CA1: Incluye total por estado, tiempo promedio de resolución y resueltos por periodo.
- CA2: El reporte es exportable en CSV.

## HU-12 — Panel del agente *(Baja)*

**Como** agente, **quiero** ver mis métricas personales, **para** conocer mi carga y productividad.

- CA1: Muestra tickets asignados, pendientes y resueltos del agente actual.
