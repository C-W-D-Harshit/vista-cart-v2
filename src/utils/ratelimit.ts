import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import ip from "ip";

export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "5 s"),
});

export const rateLimiterr = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "30 s"),
});

export async function checkRateLimit() {
  const ipp = ip.address();
  const { success, reset } = await rateLimiter.limit(ipp);

  if (!success) {
    const now = Date.now();
    const retryAfter = Math.floor((reset - now) / 1000);
    throw new Error(`Too many requests. Try again in ${retryAfter} seconds.`);
  }
}

export async function checkRateLimitForResend() {
  const ipp = ip.address();
  const { success, reset } = await rateLimiterr.limit(ipp);
  // console.log(success, reset);

  if (!success) {
    const now = Date.now();
    const retryAfter = Math.floor((reset - now) / 1000);
    throw new Error(`Try again in ${retryAfter} seconds.`);
  }
}
