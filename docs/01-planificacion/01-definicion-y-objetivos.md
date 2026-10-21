# Tec-flow — Acta de Definición del Proyecto

| Campo | Valor |
|-------|-------|
| Nombre del proyecto | Tec-flow |
| Tipo | Académico — Ingeniería de Software |
| Plataforma | Aplicación web |
| Duración estimada | ~1 mes (4 semanas + 1 de buffer) |
| Fecha de elaboración | 20 de octubre de 2026 |

## 1. Planteamiento del problema

En entornos académicos y organizacionales, las solicitudes de soporte técnico, reportes de incidentes y pedidos de mantenimiento suelen gestionarse de forma informal (correo, mensajería, hojas de cálculo o solicitudes verbales). Esto provoca:

- Pérdida de solicitudes y falta de trazabilidad.
- Tiempos de respuesta impredecibles y sin métricas.
- Dificultad para asignar y priorizar trabajo entre el personal técnico.
- Ausencia de un historial para análisis y mejora continua.

## 2. Objetivo general

Desarrollar una aplicación web que permita registrar, asignar, dar seguimiento y cerrar tickets de soporte técnico, incidentes y mantenimiento, con roles diferenciados y métricas básicas de gestión.

## 3. Objetivos específicos

1. Implementar autenticación y control de acceso por roles (Usuario, Agente, Administrador).
2. Permitir a los usuarios crear tickets y consultar su estado.
3. Permitir a los agentes asignar, priorizar, atender y cerrar tickets.
4. Ofrecer al administrador la gestión de usuarios, catálogos y reportes.
5. Registrar trazabilidad de cambios (historial por ticket).
6. Generar métricas básicas (tiempo de resolución, tickets por estado/tipo).

## 4. Justificación

Académicamente, el proyecto aplica un proceso formal de Ingeniería de Software (planificación, análisis, diseño, implementación, pruebas y despliegue) con documentación por fase. Funcionalmente, centraliza la gestión de solicitudes y aporta datos para la toma de decisiones.

## 5. Producto final

Aplicación web desplegable con:

- Módulo de autenticación y roles.
- Módulo de tickets (crear, listar, filtrar, asignar, cerrar).
- Módulo de administración (usuarios, catálogos).
- Panel de métricas/reportes básicos.
- Documentación completa del proceso y manual de usuario.
