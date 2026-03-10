import { Router } from 'express';
import * as bookingController from './booking.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

const router = Router();

router.post('/', authenticate, requireRole('parent'), bookingController.create);

export default router;
