# Tec-flow — Reglas de Negocio

| ID | Regla |
|----|-------|
| RN-01 | Todo ticket se crea con estado **Abierto**, sin agente asignado y con el usuario creador como responsable del seguimiento. |
| RN-02 | Un ticket se identifica con un consecutivo único del formato **TEC-0001** (4 dígitos, se incrementa sin reiniciar). |
| RN-03 | Un **Usuario** solo puede ver y editar (comentar/cancelar) tickets de los que es creador. |
| RN-04 | Un **Agente** puede ver todos los tickets; el **Administrador** hereda esta capacidad. |
| RN-05 | Transiciones de estado válidas: Abierto → En proceso → Resuelto → Cerrado; Abierto → Cancelado; Resuelto → En proceso (reabrir). No hay otras transiciones. |
| RN-06 | Un ticket **Abierto** solo puede ser cancelado por su creador mientras no tenga agente asignado. |
| RN-07 | Un ticket **En proceso** no puede ser cancelado por el usuario; debe resolverse o reasignarse. |
| RN-08 | Al cerrar un ticket (Resuelto → Cerrado) no se admiten más comentarios; el historial queda inmutable. |
| RN-09 | Reabrir un ticket (Resuelto → En proceso) conserva al agente asignado y todo el historial previo. |
| RN-10 | El administrador no puede desactivar ni eliminar su propia cuenta. |
| RN-11 | Los catálogos (categorías, tipos, prioridades) se **desactivan** lógicamente, nunca se borran si tienen tickets asociados. |
| RN-12 | Toda transición de estado o cambio de asignación genera un registro en el historial con fecha, autor y valores anterior/nuevo. |
| RN-13 | La prioridad la sugiere el usuario al crear el ticket; el agente puede modificarla y debe justificarlo en un comentario (implícito en el historial). |
| RN-14 | Los usuarios desactivados no pueden iniciar sesión; sus tickets y comentarios históricos se conservan. |
| RN-15 | El cierre por inactividad: un ticket Resuelto sin respuesta del usuario por más de **7 días** se cierra automáticamente con nota del sistema. |
