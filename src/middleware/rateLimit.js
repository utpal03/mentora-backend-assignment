const buckets = new Map();

const PRUNE_INTERVAL_MS = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, { timestamps, windowMs }] of buckets.entries()) {
    const windowStart = now - windowMs;
    while (timestamps.length && timestamps[0] <= windowStart) {
      timestamps.shift();
    }
    if (!timestamps.length) {
      buckets.delete(key);
    }
  }
}, PRUNE_INTERVAL_MS).unref();

export function createRateLimiter({ windowMs, max }) {
  return function rateLimit(req, res, next) {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { timestamps: [], windowMs };
      buckets.set(key, bucket);
    }

    while (bucket.timestamps.length && bucket.timestamps[0] <= windowStart) {
      bucket.timestamps.shift();
    }

    if (bucket.timestamps.length >= max) {
      return res
        .status(429)
        .json({ error: 'Too many requests, please try again later.' });
    }

    bucket.timestamps.push(now);
    next();
  };
}
