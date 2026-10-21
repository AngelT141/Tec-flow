import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos',
        details: err.flatten().fieldErrors,
      },
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: { code: 'CONFLICT', message: 'El registro ya existe' },
    });
  }

  if (err.status && err.code) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message },
    });
  }

  console.error(err);
  return res.status(500).json({
    error: { code: 'INTERNAL', message: 'Error interno del servidor' },
  });
}
