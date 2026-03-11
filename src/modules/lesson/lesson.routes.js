import { Router } from 'express';
import * as lessonController from './lesson.controller.js';
import * as sessionController from '../session/session.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

const router = Router();

router.post('/', authenticate, requireRole('MENTOR'), lessonController.create);
router.get('/', authenticate, requireRole('MENTOR'), lessonController.listForCurrentMentor);
router.get('/:id', authenticate, requireRole('MENTOR'), lessonController.getById);
router.get('/:id/sessions', authenticate, requireRole('MENTOR'), sessionController.listByLessonId);

export default router;
