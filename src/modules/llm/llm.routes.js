import { Router } from 'express';
import { summarize } from './llm.controller.js';
import { createRateLimiter } from '../../middleware/rateLimit.js';

const router = Router();

// Simple IP-based rate limiting for LLM usage.
const limiter = createRateLimiter({ windowMs: 60_000, max: 10 });
router.post('/summarize', limiter, summarize);

export default router;