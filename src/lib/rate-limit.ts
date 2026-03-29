/**
 * Simple in-memory sliding window rate limiter for Next.js middleware.
 *
 * Note: This is per-process. If you run multiple PM2 instances,
 * each process has its own counter. For production-grade rate limiting
 * consider Redis-backed solutions (e.g. @upstash/ratelimit).
 */

interface RequestRecord {
  timestamps: number[];
}

const store = new Map<string, RequestRecord>();

// Cleanup interval (every 5 minutes, remove expired entries)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, record] of store.entries()) {
    // Remove timestamps older than the window
    record.timestamps = record.timestamps.filter((t) => t > cutoff);
    if (record.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Check if a request from the given key (typically IP) is within rate limits.
 *
 * @param key - Unique identifier (usually client IP)
 * @param maxRequests - Maximum requests allowed in the window (default: 30)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 */
export function checkRateLimit(
  key: string,
  maxRequests = 30,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  // Run periodic cleanup
  cleanup(windowMs);

  let record = store.get(key);
  if (!record) {
    record = { timestamps: [] };
    store.set(key, record);
  }

  // Remove timestamps outside the window
  record.timestamps = record.timestamps.filter((t) => t > cutoff);

  // Check limit
  if (record.timestamps.length >= maxRequests) {
    const oldestInWindow = record.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetMs: oldestInWindow + windowMs - now,
    };
  }

  // Record this request
  record.timestamps.push(now);

  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Get current store size (for monitoring).
 */
export function getRateLimitStoreSize(): number {
  return store.size;
}
