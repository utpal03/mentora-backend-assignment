import { Router } from 'express';
import { summarize } from './llm.controller.js';
import { createRateLimiter } from '../../middleware/rateLimit.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Simple IP-based rate limiting for LLM usage.
const limiter = createRateLimiter({ windowMs: 60_000, max: 10 });
router.post('/summarize', authenticate, limiter, summarize);

export default router;