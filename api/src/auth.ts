import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import type { Context, Next } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { redis } from './redis.js'
import { q } from './db.js'

const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>
const COOKIE = 'gl_sid'
const SESSION_TTL = 60 * 60 * 24 * 7

export async function hashPassword(pw: string) {
  const salt = randomBytes(16)
  const key = await scrypt(pw, salt, 64)
  return `${salt.toString('hex')}:${key.toString('hex')}`
}

export async function verifyPassword(pw: string, stored: string) {
  const [salt, key] = stored.split(':')
  const derived = await scrypt(pw, Buffer.from(salt, 'hex'), 64)
  return timingSafeEqual(derived, Buffer.from(key, 'hex'))
}

export function newReferralCode(name: string) {
  const stem = name.replace(/[^a-z]/gi, '').slice(0, 4).toUpperCase().padEnd(4, 'X')
  return `${stem}-${randomBytes(3).toString('hex').toUpperCase()}`
}

export async function startSession(c: Context, userId: string) {
  const sid = randomBytes(32).toString('base64url')
  await redis.set(`sess:${sid}`, userId, 'EX', SESSION_TTL)
  setCookie(c, COOKIE, sid, {
    httpOnly: true, sameSite: 'Lax', path: '/', maxAge: SESSION_TTL,
    secure: process.env.NODE_ENV === 'production' && process.env.INSECURE_COOKIES !== '1',
  })
}

export async function endSession(c: Context) {
  const sid = getCookie(c, COOKIE)
  if (sid) await redis.del(`sess:${sid}`)
  deleteCookie(c, COOKIE, { path: '/' })
}

export type SessionUser = { id: string; name: string; email: string; referral_code: string; created_at: string }

export async function currentUser(c: Context): Promise<SessionUser | null> {
  const sid = getCookie(c, COOKIE)
  if (!sid) return null
  const userId = await redis.get(`sess:${sid}`)
  if (!userId) return null
  const { rows } = await q<SessionUser>('SELECT id, name, email, referral_code, created_at FROM users WHERE id = $1', [userId])
  return rows[0] ?? null
}

export async function requireUser(c: Context, next: Next) {
  const user = await currentUser(c)
  if (!user) return c.json({ error: 'Sign in to continue.' }, 401)
  c.set('user', user)
  await next()
}
