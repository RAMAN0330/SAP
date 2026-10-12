import { Hono } from 'hono'
import { z } from 'zod'
import { q, pool } from '../db.js'
import { allow, redis } from '../redis.js'
import { currentUser, endSession, hashPassword, newReferralCode, requireUser, startSession, verifyPassword, type SessionUser } from '../auth.js'

type Env = { Variables: { user: SessionUser } }
export const account = new Hono<Env>()

const ip = (c: { req: { header: (n: string) => string | undefined } }) =>
  c.req.header('x-forwarded-for')?.split(',')[0].trim() ?? 'local'

const publicUser = (u: SessionUser) => ({ id: u.id, name: u.name, email: u.email, referralCode: u.referral_code, createdAt: u.created_at })

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.').max(80),
  email: z.email('Enter a valid email address.').transform((s) => s.toLowerCase()),
  password: z.string().min(8, 'Use at least 8 characters.').max(128),
  referralCode: z.string().trim().toUpperCase().optional().or(z.literal('')),
})

account.post('/auth/register', async (c) => {
  if (!(await allow(`reg:${ip(c)}`, 10, 3600))) return c.json({ error: 'Too many sign-ups from this network. Try again in an hour.' }, 429)
  const parsed = registerSchema.safeParse(await c.req.json().catch(() => ({})))
  if (!parsed.success) return c.json({ error: parsed.error.issues[0].message }, 400)
  const { name, email, password, referralCode } = parsed.data

  const exists = await q('SELECT 1 FROM users WHERE email = $1', [email])
  if (exists.rowCount) return c.json({ error: 'An account with this email already exists. Log in instead.' }, 409)

  let referredBy: string | null = null
  if (referralCode) {
    const { rows } = await q<{ id: string }>('SELECT id FROM users WHERE referral_code = $1', [referralCode])
    if (!rows[0]) return c.json({ error: 'That referral code doesn’t match anyone. Check it or leave it blank.' }, 400)
    referredBy = rows[0].id
  }

  const { rows: [user] } = await q<SessionUser>(
    `INSERT INTO users (name, email, password_hash, referral_code, referred_by) VALUES ($1,$2,$3,$4,$5)
     RETURNING id, name, email, referral_code, created_at`,
    [name, email, await hashPassword(password), newReferralCode(name), referredBy])
  await startSession(c, user.id)
  return c.json({ user: publicUser(user) }, 201)
})

const loginSchema = z.object({ email: z.string().trim().toLowerCase(), password: z.string() })

account.post('/auth/login', async (c) => {
  if (!(await allow(`login:${ip(c)}`, 20, 900))) return c.json({ error: 'Too many attempts. Wait 15 minutes and try again.' }, 429)
  const parsed = loginSchema.safeParse(await c.req.json().catch(() => ({})))
  if (!parsed.success) return c.json({ error: 'Enter your email and password.' }, 400)
  const { rows: [row] } = await q<SessionUser & { password_hash: string }>(
    'SELECT id, name, email, referral_code, created_at, password_hash FROM users WHERE email = $1', [parsed.data.email])
  if (!row || !(await verifyPassword(parsed.data.password, row.password_hash))) {
    return c.json({ error: 'Email or password is incorrect.' }, 401)
  }
  await startSession(c, row.id)
  return c.json({ user: publicUser(row) })
})

account.post('/auth/logout', async (c) => {
  await endSession(c)
  return c.json({ ok: true })
})

account.get('/auth/me', async (c) => {
  const user = await currentUser(c)
  return c.json({ user: user ? publicUser(user) : null })
})

account.post('/courses/:slug/enroll', requireUser, async (c) => {
  const user = c.get('user')
  const { rows: [course] } = await q<{ id: string }>('SELECT id FROM courses WHERE slug = $1 AND published', [c.req.param('slug')])
  if (!course) return c.json({ error: 'Course not found.' }, 404)
  await q('INSERT INTO enrollments (user_id, course_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [user.id, course.id])
  return c.json({ ok: true })
})

account.put('/lessons/:id/progress', requireUser, async (c) => {
  const user = c.get('user')
  const done = Boolean((await c.req.json().catch(() => ({}))).done)
  const lessonId = c.req.param('id')
  const { rows: [ok] } = await q(`SELECT 1 FROM lessons l JOIN enrollments e ON e.course_id = l.course_id
                                  WHERE l.id = $1 AND e.user_id = $2`, [lessonId, user.id])
  if (!ok) return c.json({ error: 'Enrol in this course to track lessons.' }, 403)
  if (done) await q('INSERT INTO lesson_progress (user_id, lesson_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [user.id, lessonId])
  else await q('DELETE FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2', [user.id, lessonId])
  return c.json({ ok: true })
})

account.get('/me/enrollments', requireUser, async (c) => {
  const { rows } = await q(`
    SELECT c.slug, c.title, c.module, c.gate, c.level, c.destination, c.duration_weeks AS "durationWeeks", e.enrolled_at AS "enrolledAt",
      (SELECT count(*)::int FROM lessons l WHERE l.course_id = c.id) AS "totalLessons",
      (SELECT count(*)::int FROM lessons l JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = e.user_id
         WHERE l.course_id = c.id) AS "doneLessons",
      (SELECT json_build_object('id', l.id, 'title', l.title, 'position', l.position) FROM lessons l
         WHERE l.course_id = c.id AND NOT EXISTS (SELECT 1 FROM lesson_progress lp WHERE lp.lesson_id = l.id AND lp.user_id = e.user_id)
         ORDER BY l.position LIMIT 1) AS "nextLesson"
    FROM enrollments e JOIN courses c ON c.id = e.course_id
    WHERE e.user_id = $1 ORDER BY e.enrolled_at DESC`, [c.get('user').id])
  return c.json(rows)
})

account.get('/me/referrals', requireUser, async (c) => {
  const user = c.get('user')
  const { rows } = await q<{ name: string; joinedAt: string; enrolled: boolean }>(`
    SELECT split_part(u.name, ' ', 1) AS name, u.created_at AS "joinedAt",
      EXISTS (SELECT 1 FROM enrollments e WHERE e.user_id = u.id) AS enrolled
    FROM users u WHERE u.referred_by = $1 ORDER BY u.created_at DESC`, [user.id])
  const reward = 500
  return c.json({
    code: user.referral_code,
    rewardPerEnrolment: reward,
    friends: rows,
    earned: rows.filter((r) => r.enrolled).length * reward,
  })
})

const contactSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name.').max(80),
  lastName: z.string().trim().max(80).optional(),
  email: z.email('Enter a valid email address.'),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10, 'Tell us a little more — at least 10 characters.').max(4000),
})

account.post('/contact', async (c) => {
  if (!(await allow(`contact:${ip(c)}`, 5, 3600))) return c.json({ error: 'You’ve sent several messages already. We’ll reply soon — try again in an hour if needed.' }, 429)
  const parsed = contactSchema.safeParse(await c.req.json().catch(() => ({})))
  if (!parsed.success) return c.json({ error: parsed.error.issues[0].message }, 400)
  const m = parsed.data
  await q('INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message) VALUES ($1,$2,$3,$4,$5,$6)',
    [m.firstName, m.lastName || null, m.email, m.phone || null, m.subject || null, m.message])
  await redis.lpush('queue:contact-notify', JSON.stringify({ email: m.email, at: Date.now() }))
  return c.json({ ok: true }, 201)
})

export { pool }
