import { Router } from 'express';
import * as parentController from './parent.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.post('/signup', parentController.signup);
router.post('/login', parentController.login);
router.get('/me', authenticate, parentController.getMe);

export default router;
