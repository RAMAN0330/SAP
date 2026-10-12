import { Redis } from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6380', { maxRetriesPerRequest: 2 })

// Read-through cache for public catalogue reads.
export async function cached<T>(key: string, ttlSeconds: number, load: () => Promise<T>): Promise<T> {
  const hit = await redis.get(key)
  if (hit) return JSON.parse(hit) as T
  const value = await load()
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  return value
}

// Fixed-window limiter; returns false when the caller is over the limit.
export async function allow(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const k = `rl:${key}`
  const n = await redis.incr(k)
  if (n === 1) await redis.expire(k, windowSeconds)
  return n <= limit
}
