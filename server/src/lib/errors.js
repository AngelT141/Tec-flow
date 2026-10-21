export class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function notFound(message = 'Recurso no encontrado') {
  return new HttpError(404, 'NOT_FOUND', message);
}

export function unauthorized(message = 'No autenticado') {
  return new HttpError(401, 'UNAUTHORIZED', message);
}

export function forbidden(message = 'No tienes permiso para esta operación') {
  return new HttpError(403, 'FORBIDDEN', message);
}

export function badRequest(message = 'Datos inválidos') {
  return new HttpError(400, 'BAD_REQUEST', message);
}

export function conflict(message = 'El registro ya existe') {
  return new HttpError(409, 'CONFLICT', message);
}
