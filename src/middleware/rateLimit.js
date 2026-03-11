const buckets = new Map();

export function createRateLimiter({ windowMs, max }) {
  return function rateLimit(req, res, next) {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = [];
      buckets.set(key, bucket);
    }

    // Drop old entries
    while (bucket.length && bucket[0] <= windowStart) {
      bucket.shift();
    }

    if (bucket.length >= max) {
      return res
        .status(429)
        .json({ error: 'Too many requests, please try again later.' });
    }

    bucket.push(now);
    next();
  };
}

