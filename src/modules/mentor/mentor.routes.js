import { Router } from 'express';
import * as mentorController from './mentor.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.post('/signup', mentorController.signup);
router.post('/login', mentorController.login);
router.get('/me', authenticate, mentorController.getMe);

export default router;
