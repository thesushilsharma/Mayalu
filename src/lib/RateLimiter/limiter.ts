import { RateLimiter } from "limiter";

// Rate limiter to prevent brute force attacks
export const loginLimiter = new RateLimiter({ tokensPerInterval: 5, interval: 'minute' });
export const signupLimiter = new RateLimiter({ tokensPerInterval: 3, interval: 'hour' });