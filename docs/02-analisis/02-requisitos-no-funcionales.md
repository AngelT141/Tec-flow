# Tec-flow — Requisitos No Funcionales

| ID | Categoría | Requisito | Criterio verificable |
|----|-----------|-----------|----------------------|
| NFR-01 | Seguridad | Las contraseñas deben almacenarse de forma irreversible (hash con salt). | Imposible leer contraseñas en BD; usar bcrypt o argon2. |
| NFR-02 | Seguridad | La autorización por rol debe validarse en el servidor, no solo en la interfaz. | Endpoints protegidos rechazan accesos no autorizados con 401/403. |
| NFR-03 | Seguridad | Las sesiones/tokens deben expirar y poder cerrarse. | Sesión inválida tras expiración o cierre. |
| NFR-04 | Seguridad | Todo dato de entrada debe validarse (campos obligatorios, longitudes, formatos). | Entradas inválidas rechazadas con mensaje claro. |
| NFR-05 | Rendimiento | Las páginas principales deben cargar en menos de 2 segundos con uso normal. | Medición con listado de tickets y tablero. |
| NFR-06 | Rendimiento | El sistema debe soportar al menos 50 usuarios concurrentes sin degradación crítica. | Prueba de carga básica aprobada. |
| NFR-07 | Disponibilidad | Disponibilidad objetivo del 95% durante el horario del proyecto. | Registro de caídas del proveedor de hosting. |
| NFR-08 | Usabilidad | El usuario debe poder crear un ticket en un máximo de 3 pasos/pantallas. | Recorrido de usabilidad verificado. |
| NFR-09 | Usabilidad | La interfaz debe ser responsive (usable en móvil vía navegador). | Sin elementos inaccesibles en viewport de 375 px. |
| NFR-10 | Confiabilidad | No debe perderse la trazabilidad de un ticket por eliminación física. | Estados desactivados (lógicos), historial persistente. |
| NFR-11 | Mantenibilidad | El código debe seguir convenciones y guía de estilo definidas. | Revisión estática sin errores críticos de estilo. |
| NFR-12 | Mantenibilidad | La arquitectura debe separar presentación, lógica y datos. | Estructura de carpetas y capas documentadas en diseño. |
| NFR-13 | Portabilidad | Debe ejecutarse en navegadores modernos (Chrome, Firefox, Edge, Safari actuales). | Pruebas de compatibilidad en los 4 navegadores. |
| NFR-14 | Datos | Debe existir un mecanismo de respaldo (backup) de la base de datos. | Backup automático del proveedor o script documentado. |
| NFR-15 | Cumplimiento | El sistema debe registrar fecha y hora de operaciones críticas en hora del servidor. | Campos created_at/updated_at en entidades principales. |
