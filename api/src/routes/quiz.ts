import { randomUUID, randomInt } from 'node:crypto'
import { Hono } from 'hono'
import { z } from 'zod'
import { q } from '../db.js'
import { redis } from '../redis.js'
import { currentUser, requireUser, type SessionUser } from '../auth.js'
import { offeredSlugs } from '../seed/courses.js'
import { quizBank, type QuizQuestion } from '../seed/quiz.js'

type Env = { Variables: { user: SessionUser } }
export const quiz = new Hono<Env>()

const offeredModules = new Set(offeredSlugs.map((s) => s.replace(/^sap-/, '').toUpperCase()))
const modules = Object.keys(quizBank).filter((m) => offeredModules.has(m.toUpperCase()))

/** First quiz is free for every account; enrolment in any course unlocks unlimited quizzes. */
async function access(userId: string) {
  const [{ rows: [a] }, { rows: [e] }] = await Promise.all([
    q<{ n: number }>('SELECT count(*)::int AS n FROM quiz_attempts WHERE user_id = $1', [userId]),
    q<{ n: number }>('SELECT count(*)::int AS n FROM enrollments WHERE user_id = $1', [userId]),
  ])
  const enrolled = e.n > 0
  return { attempts: a.n, enrolled, canPlay: enrolled || a.n === 0, freeAvailable: !enrolled && a.n === 0 }
}

function shuffle(n: number) {
  const p = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = randomInt(i + 1); [p[i], p[j]] = [p[j], p[i]] }
  return p
}

quiz.get('/quiz', async (c) => {
  const user = await currentUser(c)
  const status = user ? await access(user.id) : null
  let best: Record<string, number> = {}
  if (user) {
    const { rows } = await q<{ module: string; best: number }>(
      'SELECT module, max(score)::int AS best FROM quiz_attempts WHERE user_id = $1 GROUP BY module', [user.id])
    best = Object.fromEntries(rows.map((r) => [r.module, r.best]))
  }
  return c.json({ modules: modules.map((m) => ({ module: m, count: quizBank[m].length, best: best[m] ?? null })), status })
})

quiz.post('/quiz/:module/start', requireUser, async (c) => {
  const module = c.req.param('module') ?? ''
  const bank: QuizQuestion[] | undefined = quizBank[module]
  if (!bank || !modules.includes(module)) return c.json({ error: 'There is no quiz for that module yet.' }, 404)
  const status = await access(c.get('user').id)
  if (!status.canPlay) return c.json({ error: 'You have used your free quiz. Quiz access is included with every course.', code: 'LOCKED' }, 403)

  const id = randomUUID()
  const perms = bank.map(() => shuffle(4))
  await redis.set(`quiz:${id}`, JSON.stringify({ userId: c.get('user').id, module, perms }), 'EX', 3600)
  return c.json({
    attemptId: id,
    module,
    questions: bank.map((x, i) => ({ q: x.q, options: perms[i].map((k) => x.o[k]) })),
  })
})

const submitSchema = z.object({ attemptId: z.uuid(), answers: z.array(z.number().int().min(-1).max(3)) })

quiz.post('/quiz/:module/submit', requireUser, async (c) => {
  const parsed = submitSchema.safeParse(await c.req.json().catch(() => ({})))
  if (!parsed.success) return c.json({ error: 'That quiz submission was not valid.' }, 400)
  const { attemptId, answers } = parsed.data
  const raw = await redis.getdel(`quiz:${attemptId}`)
  if (!raw) return c.json({ error: 'This quiz has expired. Start it again.' }, 410)
  const saved = JSON.parse(raw) as { userId: string; module: string; perms: number[][] }
  const user = c.get('user')
  if (saved.userId !== user.id || saved.module !== c.req.param('module')) return c.json({ error: 'This quiz belongs to another session.' }, 403)

  const status = await access(user.id)
  if (!status.canPlay) return c.json({ error: 'You have used your free quiz. Quiz access is included with every course.', code: 'LOCKED' }, 403)

  const bank: QuizQuestion[] = quizBank[saved.module]
  const review = bank.map((x, i) => {
    const perm = saved.perms[i]
    const chosen = answers[i] ?? -1
    const correctShown = perm.indexOf(x.a)
    return { chosen, correct: correctShown, right: chosen === correctShown, why: x.why }
  })
  const score = review.filter((r) => r.right).length
  await q('INSERT INTO quiz_attempts (user_id, module, score, total) VALUES ($1,$2,$3,$4)', [user.id, saved.module, score, bank.length])
  return c.json({ score, total: bank.length, review, status: await access(user.id) })
})
