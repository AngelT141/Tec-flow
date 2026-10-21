# Tec-flow — Casos de Uso

Actores: **Usuario** (requerente), **Agente** (soporte técnico), **Administrador**. El sistema se describe con actores principales y casos de uso numerados (CU-xx).

---

## CU-01: Iniciar sesión

- **Actor:** Usuario, Agente, Administrador
- **Precondiciones:** La cuenta existe y está activa.
- **Flujo principal:**
  1. El actor ingresa correo y contraseña.
  2. El sistema valida las credenciales.
  3. El sistema inicia la sesión y muestra el panel correspondiente a su rol.
- **Flujos alternativos:**
  - 2a. Credenciales incorrectas: mensaje de error sin revelar cuál campo falló.
  - 2b. Cuenta desactivada: mensaje de cuenta bloqueada.
- **Postcondiciones:** Sesión iniciada.

## CU-02: Registrarse

- **Actor:** Invitado
- **Precondiciones:** El correo no está registrado.
- **Flujo principal:**
  1. El invitado completa nombre, correo y contraseña.
  2. El sistema valida los datos y crea la cuenta con rol "Usuario".
  3. El sistema redirige al inicio de sesión.
- **Postcondiciones:** Cuenta creada con rol Usuario.

## CU-03: Crear ticket

- **Actor:** Usuario
- **Precondiciones:** Sesión iniciada como Usuario.
- **Flujo principal:**
  1. El usuario selecciona "Nuevo ticket".
  2. El sistema muestra el formulario (tipo, asunto, descripción, categoría, prioridad).
  3. El usuario completa y envía el formulario.
  4. El sistema valida, crea el ticket con estado "Abierto" y asigna el consecutivo TEC-xxxx.
  5. El sistema confirma la creación.
- **Flujos alternativos:**
  - 3a. Datos inválidos: el sistema muestra errores por campo.
- **Postcondiciones:** Ticket creado en estado Abierto.

## CU-04: Consultar mis tickets

- **Actor:** Usuario
- **Flujo principal:**
  1. El usuario accede a "Mis tickets".
  2. El sistema lista los tickets del usuario (filtros: estado, tipo, prioridad).
  3. El usuario selecciona uno para ver el detalle con historial.
- **Restricción:** Solo ve tickets propios (regla de negocio RN-03).

## CU-05: Comentar en ticket

- **Actor:** Usuario, Agente, Administrador
- **Precondiciones:** El ticket es visible para el actor y está en estado que permite comentarios (no Cancelado/Cerrado).
- **Flujo principal:**
  1. El actor escribe un comentario en el ticket.
  2. El sistema valida y agrega el comentario al historial.
- **Postcondiciones:** Comentario visible para usuario creador, agentes y administradores.

## CU-06: Cancelar ticket

- **Actor:** Usuario
- **Precondiciones:** El ticket está Abierto y sin agente asignado.
- **Flujo principal:**
  1. El usuario selecciona "Cancelar ticket".
  2. El sistema solicita confirmación.
  3. El usuario confirma.
  4. El sistema cambia el estado a "Cancelado".
- **Postcondiciones:** Ticket cancelado (no editable).

## CU-07: Atender ticket

- **Actor:** Agente, Administrador
- **Precondiciones:** El ticket está Abierto o En proceso.
- **Flujo principal:**
  1. El agente selecciona un ticket de la bandeja.
  2. El agente se asigna el ticket (estado → En proceso).
  3. El agente atiende y comenta el avance.
  4. El agente marca "Resolver" (estado → Resuelto) con nota de resolución.
- **Flujos alternativos:**
  - Reasignar a otro agente.
- **Postcondiciones:** Ticket Resuelto y visible para confirmación del usuario.

## CU-08: Cerrar o reabrir ticket

- **Actor:** Usuario
- **Precondiciones:** El ticket está Resuelto.
- **Flujo principal:**
  1. El usuario recibe notificación de resolución.
  2. El usuario elige "Cerrar" (problema solucionado) o "Reabrir" (no resuelto).
  3. El sistema aplica el cambio y lo registra en el historial.
- **Postcondiciones:** Estado Cerrado o regreso a En proceso.

## CU-09: Gestionar usuarios

- **Actor:** Administrador
- **Flujo principal:**
  1. El administrador accede a "Usuarios".
  2. Crea, edita, desactiva o reactiva usuarios y cambia roles.
- **Restricción:** no puede desactivar su propia cuenta (RN-10).

## CU-10: Gestionar catálogos

- **Actor:** Administrador
- **Flujo principal:**
  1. El administrador accede a "Catálogos" (categorías, tipos, prioridades).
  2. Agrega, edita o desactiva entradas.

## CU-11: Ver reportes

- **Actor:** Administrador
- **Flujo principal:**
  1. El administrador accede a "Reportes".
  2. Consulta métricas por estado, tipo, prioridad y periodo.
  3. Opcionalmente exporta los datos (CSV).

## CU-12: Ver mis métricas

- **Actor:** Agente
- **Flujo principal:**
  1. El agente abre su panel.
  2. Ve tickets asignados, resueltos y pendientes.
