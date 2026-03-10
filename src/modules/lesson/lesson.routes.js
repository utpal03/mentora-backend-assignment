import { Router } from 'express';
import * as lessonController from './lesson.controller.js';
import * as sessionController from '../session/session.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

const router = Router();

router.post('/', authenticate, requireRole('mentor'), lessonController.create);
router.get('/:id/sessions', authenticate, sessionController.listByLessonId);
router.get('/:id', authenticate, lessonController.getById);

export default router;
