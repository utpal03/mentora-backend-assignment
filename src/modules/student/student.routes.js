import { Router } from 'express';
import * as studentController from './student.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate, requireRole('parent'));

router.post('/', studentController.create);
router.get('/', studentController.list);

export default router;
