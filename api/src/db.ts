import pg from 'pg'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { seedCourses, lessonsFor, offeredSlugs, type SeedCourse } from './seed/courses.js'
import { seedBlogs } from './seed/blogs.js'

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://golive:golive_dev_pw@localhost:5433/golive',
  max: 10,
})

export const q = <T extends pg.QueryResultRow = any>(text: string, params?: unknown[]) => pool.query<T>(text, params)

export async function migrateAndSeed() {
  const sql = await readFile(fileURLToPath(new URL('./schema.sql', import.meta.url)), 'utf8')
  await pool.query(sql)

  const { rows } = await q<{ n: string }>('SELECT count(*)::text AS n FROM courses')
  if (rows[0].n === '0') {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      for (const [i, c] of seedCourses.entries()) await insertCourse(client, c, i + 1)
      for (const b of seedBlogs) {
        await client.query(
          `INSERT INTO blog_posts (slug, title, excerpt, category, author, read_minutes, body, published_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7, now() - make_interval(days => $8))`,
          [b.slug, b.title, b.excerpt, b.category, b.author, b.readMinutes, b.body, b.daysAgo],
        )
      }
      await client.query('COMMIT')
      console.log(`seeded ${seedCourses.length} courses, ${seedBlogs.length} posts`)
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }

  // Courses added to the seed after the first boot: insert the missing ones, then show only the courses on sale.
  const { rows: existing } = await q<{ slug: string; max: number }>('SELECT slug, max(catalog_order) OVER () AS max FROM courses')
  const have = new Set(existing.map((r) => r.slug))
  let order = existing[0]?.max ?? 0
  for (const c of seedCourses) {
    if (have.has(c.slug)) continue
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await insertCourse(client, c, ++order)
      await client.query('COMMIT')
      console.log(`added course ${c.slug}`)
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
  // Listing order follows the owner's list; hidden courses move to the end.
  await q(`UPDATE courses SET published = (slug = ANY($1::text[])),
             catalog_order = coalesce(array_position($1::text[], slug), 100 + (SELECT count(*) FROM courses c2 WHERE c2.slug < courses.slug))`, [offeredSlugs])

  // Articles added to the seed after the first boot: insert any that are missing, never touch existing ones.
  let added = 0
  for (const b of seedBlogs) {
    const r = await q(
      `INSERT INTO blog_posts (slug, title, excerpt, category, author, read_minutes, body, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7, now() - make_interval(days => $8))
       ON CONFLICT (slug) DO NOTHING`,
      [b.slug, b.title, b.excerpt, b.category, b.author, b.readMinutes, b.body, b.daysAgo],
    )
    added += r.rowCount ?? 0
  }
  if (added) console.log(`added ${added} new blog posts`)
}

async function insertCourse(client: pg.PoolClient, c: SeedCourse, order: number) {
  const { rows: [course] } = await client.query<{ id: string }>(
    `INSERT INTO courses (slug, catalog_order, title, module, track, description, overview, price, duration_weeks, level,
       lessons_count, questions_count, demand, target_role, instructor_name, instructor_bio, learn_points)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING id`,
    [c.slug, order, c.title, c.module, c.track, c.description, c.overview, c.price, c.weeks, c.level,
     c.lessons, c.questions, c.demand, c.role, `${c.module} mentor`,
     'Industry expert with a minimum of 8 years’ SAP experience.', c.learn],
  )
  for (const [p, l] of lessonsFor(c).entries()) {
    await client.query('INSERT INTO lessons (course_id, position, title, description, minutes) VALUES ($1,$2,$3,$4,$5)',
      [course.id, p + 1, l.title, l.description, l.minutes])
  }
  for (const [p, x] of c.qa.entries()) {
    await client.query('INSERT INTO interview_questions (course_id, position, question, answer, difficulty) VALUES ($1,$2,$3,$4,$5)',
      [course.id, p + 1, x.q, x.a, x.d])
  }
}
