const ETIQUETAS_ESTADO = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En proceso',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
  CANCELLED: 'Cancelado',
};

const ETIQUETAS_PRIORIDAD = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

const ETIQUETAS_TIPO = {
  SUPPORT: 'Soporte',
  INCIDENT: 'Incidente',
  MAINTENANCE: 'Mantenimiento',
};

const CLASES = {
  OPEN: 'badge-azul',
  IN_PROGRESS: 'badge-ambar',
  RESOLVED: 'badge-verde',
  CLOSED: 'badge-gris',
  CANCELLED: 'badge-rojo',
  LOW: 'badge-gris',
  MEDIUM: 'badge-azul',
  HIGH: 'badge-ambar',
  CRITICAL: 'badge-rojo',
  SUPPORT: 'badge-azul',
  INCIDENT: 'badge-rojo',
  MAINTENANCE: 'badge-verde',
};

export function StatusBadge({ status }) {
  return <span className={`badge ${CLASES[status]}`}>{ETIQUETAS_ESTADO[status] || status}</span>;
}

export function PriorityBadge({ priority }) {
  return <span className={`badge ${CLASES[priority]}`}>{ETIQUETAS_PRIORIDAD[priority] || priority}</span>;
}

export function TypeBadge({ type }) {
  return <span className={`badge ${CLASES[type]}`}>{ETIQUETAS_TIPO[type] || type}</span>;
}

export function ticketCode(number) {
  return `TEC-${String(number).padStart(4, '0')}`;
}

export { ETIQUETAS_ESTADO, ETIQUETAS_PRIORIDAD, ETIQUETAS_TIPO };
