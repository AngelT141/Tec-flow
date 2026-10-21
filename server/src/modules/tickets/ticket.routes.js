import { Router } from 'express';
import * as ticketController from './ticket.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createTicketSchema, listQuerySchema } from './ticket.schemas.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listQuerySchema, 'query'), ticketController.list);
router.post('/', validate(createTicketSchema), ticketController.create);
router.get('/:id', ticketController.getOne);
router.get('/:id/history', ticketController.history);
router.post('/:id/comments', ticketController.addComment);
router.post('/:id/assign', requireRole('AGENT', 'ADMIN'), ticketController.assign);
router.post('/:id/resolve', requireRole('AGENT', 'ADMIN'), ticketController.resolve);
router.post('/:id/close', ticketController.close);
router.post('/:id/reopen', ticketController.reopen);
router.post('/:id/cancel', ticketController.cancel);

export default router;
