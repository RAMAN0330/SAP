import { createHash, randomInt, timingSafeEqual } from 'node:crypto'
import { redis } from './redis.js'

const TTL = 600
const MAX_TRIES = 5
const digest = (email: string, code: string) => createHash('sha256').update(`${email}:${code}`).digest('hex')

export const newCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0')

/** Store a code (and any payload) for this email and purpose, replacing an earlier one. */
export async function saveCode<T extends object>(purpose: string, email: string, code: string, payload: T) {
  await redis.set(`otp:${purpose}:${email}`, JSON.stringify({ ...payload, hash: digest(email, code), tries: 0 }), 'EX', TTL)
}

export async function pending<T>(purpose: string, email: string): Promise<T | null> {
  const raw = await redis.get(`otp:${purpose}:${email}`)
  return raw ? (JSON.parse(raw) as T) : null
}

/** Check a code. Returns the payload on success (and deletes it), or an error message. */
export async function checkCode<T>(purpose: string, email: string, code: string): Promise<{ ok: true; payload: T } | { ok: false; error: string }> {
  const key = `otp:${purpose}:${email}`
  const raw = await redis.get(key)
  if (!raw) return { ok: false, error: 'That code has expired. Ask for a new one.' }
  const saved = JSON.parse(raw) as T & { hash: string; tries: number }
  if (saved.tries >= MAX_TRIES) {
    await redis.del(key)
    return { ok: false, error: 'Too many wrong codes. Ask for a new one.' }
  }
  const a = Buffer.from(saved.hash, 'hex')
  const b = Buffer.from(digest(email, code.trim()), 'hex')
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    const ttl = await redis.ttl(key)
    await redis.set(key, JSON.stringify({ ...saved, tries: saved.tries + 1 }), 'EX', Math.max(ttl, 1))
    return { ok: false, error: 'That code is not right. Check the email and try again.' }
  }
  await redis.del(key)
  return { ok: true, payload: saved }
}
