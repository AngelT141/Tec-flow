import { z } from 'zod';

const ESTADOS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];
const TIPOS = ['SUPPORT', 'INCIDENT', 'MAINTENANCE'];
const PRIORIDADES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const createTicketSchema = z.object({
  title: z.string().trim().min(4, 'El asunto debe tener al menos 4 caracteres').max(120),
  description: z.string().trim().min(10, 'La descripción debe tener al menos 10 caracteres').max(5000),
  type: z.enum(TIPOS),
  priority: z.enum(PRIORIDADES).default('MEDIUM'),
  categoryId: z.coerce.number().int().positive('Selecciona una categoría'),
});

export const listQuerySchema = z.object({
  status: z.enum(ESTADOS).optional(),
  type: z.enum(TIPOS).optional(),
  priority: z.enum(PRIORIDADES).optional(),
  q: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const assignSchema = z.object({
  assigneeId: z.string().uuid().optional(),
});

export const resolveSchema = z.object({
  resolutionNote: z
    .string()
    .trim()
    .min(5, 'La nota de resolución debe tener al menos 5 caracteres')
    .max(2000),
});

export const commentSchema = z.object({
  content: z.string().trim().min(1, 'El comentario no puede estar vacío').max(2000),
});
