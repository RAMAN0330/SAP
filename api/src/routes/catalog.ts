import { Hono } from 'hono'
import { q } from '../db.js'
import { cached } from '../redis.js'
import { currentUser } from '../auth.js'

export const catalog = new Hono()

// Next cohort start for a course: staggered so listings always show a spread of dates.
function departure(gate: number, now = new Date()) {
  const d = new Date(now)
  d.setHours(9, 30 + (gate % 4) * 15, 0, 0)
  const toMonday = (8 - d.getDay()) % 7 || 7
  d.setDate(d.getDate() + toMonday + (gate % 3) * 7 - (gate % 2 ? 4 : 0))
  if (d <= now) d.setDate(d.getDate() + 7)
  const days = Math.ceil((d.getTime() - now.getTime()) / 86_400_000)
  const status = days <= 3 ? 'FINAL CALL' : days <= 10 ? 'BOARDING' : 'ON TIME'
  return { departsAt: d.toISOString(), status }
}

const COURSE_COLS = `id, slug, gate, title, module, track, description, overview, price, duration_weeks AS "durationWeeks", level,
  lessons_count AS "lessonsCount", questions_count AS "questionsCount", demand, destination,
  json_build_object('name', instructor_name, 'bio', instructor_bio) AS instructor, learn_points AS "learnPoints"`

type CourseRow = { gate: number; [k: string]: unknown }
const withDeparture = <T extends CourseRow>(c: T) => ({ ...c, ...departure(c.gate) })

catalog.get('/courses', async (c) => {
  const rows = await cached('courses:all', 300, async () =>
    (await q<CourseRow>(`SELECT ${COURSE_COLS} FROM courses WHERE published ORDER BY gate`)).rows)
  return c.json(rows.map(withDeparture))
})

catalog.get('/courses/:slug', async (c) => {
  const slug = c.req.param('slug')
  const data = await cached(`course:${slug}`, 300, async () => {
    const { rows: [course] } = await q<CourseRow & { id: string }>(`SELECT ${COURSE_COLS} FROM courses WHERE slug = $1 AND published`, [slug])
    if (!course) return null
    const [lessons, questions] = await Promise.all([
      q('SELECT id, position, title, description, minutes FROM lessons WHERE course_id = $1 ORDER BY position', [course.id]),
      q('SELECT id, question, answer, difficulty FROM interview_questions WHERE course_id = $1 ORDER BY position', [course.id]),
    ])
    return { course, lessons: lessons.rows, questions: questions.rows }
  })
  if (!data) return c.json({ error: 'Course not found.' }, 404)

  const user = await currentUser(c)
  let enrollment = null
  if (user) {
    const { rows } = await q(`SELECT e.enrolled_at AS "enrolledAt",
        coalesce(array_agg(lp.lesson_id) FILTER (WHERE lp.lesson_id IS NOT NULL), '{}') AS "completedLessonIds"
      FROM enrollments e
      LEFT JOIN lessons l ON l.course_id = e.course_id
      LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = e.user_id
      WHERE e.user_id = $1 AND e.course_id = $2 GROUP BY e.enrolled_at`, [user.id, data.course.id])
    enrollment = rows[0] ?? null
  }
  return c.json({ ...data, course: withDeparture(data.course), enrollment })
})

catalog.get('/stats', async (c) => c.json(await cached('stats', 300, async () => {
  const { rows: [s] } = await q(`SELECT count(*)::int AS modules, sum(lessons_count)::int AS lessons, sum(questions_count)::int AS questions FROM courses WHERE published`)
  return s
})))

catalog.get('/blogs', async (c) => c.json(await cached('blogs:all', 300, async () =>
  (await q(`SELECT slug, title, excerpt, category, author, read_minutes AS "readMinutes", published_at AS "publishedAt"
            FROM blog_posts ORDER BY published_at DESC`)).rows)))

catalog.get('/blogs/:slug', async (c) => {
  const { rows: [post] } = await q(`SELECT slug, title, excerpt, category, author, read_minutes AS "readMinutes", body, published_at AS "publishedAt"
    FROM blog_posts WHERE slug = $1`, [c.req.param('slug')])
  if (!post) return c.json({ error: 'Article not found.' }, 404)
  return c.json(post)
})
