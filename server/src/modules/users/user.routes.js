import { Router } from 'express';
import * as userController from './user.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createUserSchema, updateUserSchema, listUsersQuerySchema } from './user.schemas.js';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/', validate(listUsersQuerySchema, 'query'), userController.list);
router.post('/', validate(createUserSchema), userController.create);
router.patch('/:id', validate(updateUserSchema), userController.update);
router.patch('/:id/toggle', userController.toggle);

export default router;
