import { Router } from 'express';
import * as sessionController from './session.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

const router = Router();

router.post('/', authenticate, requireRole('MENTOR'), sessionController.create);
router.post('/:id/join', authenticate, requireRole('MENTOR', 'PARENT', 'STUDENT'), sessionController.join);

export default router;
