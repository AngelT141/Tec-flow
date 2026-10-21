import { api } from './client.js';

export function obtenerTickets(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) qs.set(key, value);
  });
  const query = qs.toString();
  return api(`/tickets${query ? `?${query}` : ''}`);
}

export function crearTicket(body) {
  return api('/tickets', { method: 'POST', body });
}

export function obtenerTicket(id) {
  return api(`/tickets/${id}`);
}

export function obtenerHistorial(id) {
  return api(`/tickets/${id}/history`);
}

export function comentar(id, content) {
  return api(`/tickets/${id}/comments`, { method: 'POST', body: { content } });
}

export function asignar(id, assigneeId) {
  return api(`/tickets/${id}/assign`, {
    method: 'POST',
    body: assigneeId ? { assigneeId } : {},
  });
}

export function resolver(id, resolutionNote) {
  return api(`/tickets/${id}/resolve`, { method: 'POST', body: { resolutionNote } });
}

export function cerrar(id) {
  return api(`/tickets/${id}/close`, { method: 'POST' });
}

export function reabrir(id) {
  return api(`/tickets/${id}/reopen`, { method: 'POST' });
}

export function cancelar(id) {
  return api(`/tickets/${id}/cancel`, { method: 'POST' });
}

export function obtenerCategorias() {
  return api('/categories');
}
