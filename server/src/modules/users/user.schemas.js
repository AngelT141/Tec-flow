import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(80),
  email: z.string().trim().toLowerCase().email('Correo inválido').max(120),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(72),
  role: z.enum(['USER', 'AGENT', 'ADMIN']).default('USER'),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(80).optional(),
    email: z.string().trim().toLowerCase().email('Correo inválido').max(120).optional(),
    role: z.enum(['USER', 'AGENT', 'ADMIN']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'No hay campos para actualizar' });

export const listUsersQuerySchema = z.object({
  role: z.enum(['USER', 'AGENT', 'ADMIN']).optional(),
  active: z.enum(['true', 'false']).optional(),
  q: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
