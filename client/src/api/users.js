import { api } from './client.js';

export function obtenerUsuarios(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) qs.set(key, value);
  });
  const query = qs.toString();
  return api(`/users${query ? `?${query}` : ''}`);
}

export function crearUsuario(body) {
  return api('/users', { method: 'POST', body });
}

export function actualizarUsuario(id, body) {
  return api(`/users/${id}`, { method: 'PATCH', body });
}

export function alternarUsuario(id) {
  return api(`/users/${id}/toggle`, { method: 'PATCH' });
}
