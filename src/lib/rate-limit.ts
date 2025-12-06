/**
 * Simple in-memory rate limiting utility.
 * 
 * For production, consider using Redis-based rate limiting
 * for multi-instance deployments.
 * 
 * Usage:
 *   const limiter = createRateLimiter({ maxRequests: 60, windowMs: 60000 });
 *   const { success, remaining } = limiter.check(ip);
 */

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  /** Whether the request should be allowed */
  success: boolean;
  /** Requests remaining in the current window */
  remaining: number;
  /** Timestamp when the window resets */
  resetAt: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limit tracking
// In production, use Redis or similar for multi-instance support
const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60000; // 1 minute

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  
  lastCleanup = now;
  const cutoff = now - windowMs;
  
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < cutoff) {
      store.delete(key);
    }
  }
}

/**
 * Creates a rate limiter with the specified configuration.
 */
export function createRateLimiter(config: RateLimitConfig) {
  const { maxRequests, windowMs } = config;

  return {
    /**
     * Check if a request should be allowed for the given identifier.
     * @param identifier - Usually the IP address or user ID
     */
    check(identifier: string): RateLimitResult {
      cleanup(windowMs);
      
      const now = Date.now();
      const entry = store.get(identifier);

      // New visitor or window has reset
      if (!entry || entry.resetAt <= now) {
        store.set(identifier, {
          count: 1,
          resetAt: now + windowMs,
        });
        return {
          success: true,
          remaining: maxRequests - 1,
          resetAt: now + windowMs,
        };
      }

      // Within existing window
      if (entry.count < maxRequests) {
        entry.count++;
        return {
          success: true,
          remaining: maxRequests - entry.count,
          resetAt: entry.resetAt,
        };
      }

      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    },

    /**
     * Reset the rate limit for a specific identifier.
     */
    reset(identifier: string): void {
      store.delete(identifier);
    },
  };
}

// Pre-configured rate limiters for common use cases
export const rateLimiters = {
  /** Standard API rate limit: 60 req/min */
  api: createRateLimiter({ maxRequests: 60, windowMs: 60000 }),
  
  /** Search suggestions: 100 req/min */
  search: createRateLimiter({ maxRequests: 100, windowMs: 60000 }),
  
  /** Ingredient analysis: 10 req/min (CPU intensive) */
  analysis: createRateLimiter({ maxRequests: 10, windowMs: 60000 }),
  
  /** Affiliate clicks: 30 req/min per IP */
  affiliate: createRateLimiter({ maxRequests: 30, windowMs: 60000 }),
};

/**
 * Get the client IP address from the request.
 * Works with various proxy configurations.
 */
export function getClientIP(request: Request): string {
  // Check various headers set by proxies
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(",")[0].trim();
  }
  
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  
  // Fallback - in Vercel, this header is available
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    return vercelForwarded.split(",")[0].trim();
  }
  
  // Default fallback
  return "unknown";
}

/**
 * Helper to apply rate limiting to a route handler.
 */
export function withRateLimit(
  limiter: ReturnType<typeof createRateLimiter>,
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    const ip = getClientIP(request);
    const result = limiter.check(ip);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.resetAt),
          },
        }
      );
    }
    
    const response = await handler(request);
    
    // Add rate limit headers to successful responses
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("X-RateLimit-Remaining", String(result.remaining));
    newResponse.headers.set("X-RateLimit-Reset", String(result.resetAt));
    
    return newResponse;
  };
}

