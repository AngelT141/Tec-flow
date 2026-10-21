import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { notFound, badRequest } from '../../lib/errors.js';

const router = Router();

const categorySchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(60),
});

function parseId(param) {
  const id = Number(param);
  if (!Number.isInteger(id) || id <= 0) throw badRequest('ID inválido');
  return id;
}

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const esAdmin = req.user.role === 'ADMIN';
    const items = await prisma.category.findMany({
      where: esAdmin ? {} : { active: true },
      orderBy: { name: 'asc' },
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.use(requireAuth, requireRole('ADMIN'));

router.post('/', validate(categorySchema), async (req, res, next) => {
  try {
    const category = await prisma.category.create({ data: { name: req.body.name } });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', validate(categorySchema), async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw notFound('Categoría no encontrada');
    const category = await prisma.category.update({ where: { id }, data: { name: req.body.name } });
    res.json(category);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw notFound('Categoría no encontrada');
    const category = await prisma.category.update({
      where: { id },
      data: { active: !existing.active },
    });
    res.json(category);
  } catch (err) {
    next(err);
  }
});

export default router;
