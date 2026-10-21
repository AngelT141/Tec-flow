import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

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

router.use(requireRole('ADMIN'));

export default router;
