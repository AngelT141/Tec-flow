import { Router } from 'express';
import * as reportController from './report.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { summaryQuerySchema } from './report.schemas.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/summary',
  requireRole('ADMIN'),
  validate(summaryQuerySchema, 'query'),
  reportController.summary
);
router.get('/agent/me', requireRole('AGENT', 'ADMIN'), reportController.agentMe);

export default router;
