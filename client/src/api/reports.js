import { api } from './client.js';

export function obtenerResumen({ from, to } = {}) {
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  const query = qs.toString();
  return api(`/reports/summary${query ? `?${query}` : ''}`);
}

export function obtenerMisMetricas() {
  return api('/reports/agent/me');
}
