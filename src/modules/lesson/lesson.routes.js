import { Router } from 'express';
import * as lessonController from './lesson.controller.js';
import * as sessionController from '../session/session.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

const router = Router();

router.post('/', authenticate, requireRole('MENTOR'), lessonController.create);
router.get('/', authenticate, requireRole('MENTOR', 'PARENT', 'STUDENT'), lessonController.listForCurrentMentor);
router.get('/:id', authenticate, requireRole('MENTOR', 'PARENT', 'STUDENT'), lessonController.getById);
router.get('/:id/sessions', authenticate, requireRole('MENTOR', 'PARENT', 'STUDENT'), sessionController.listByLessonId);

export default router;
