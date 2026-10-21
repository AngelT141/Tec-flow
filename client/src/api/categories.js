import { api } from './client.js';

export function listarCategorias() {
  return api('/categories');
}

export function crearCategoria(name) {
  return api('/categories', { method: 'POST', body: { name } });
}

export function renombrarCategoria(id, name) {
  return api(`/categories/${id}`, { method: 'PATCH', body: { name } });
}

export function alternarCategoria(id) {
  return api(`/categories/${id}/toggle`, { method: 'PATCH' });
}
