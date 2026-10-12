import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { migrateAndSeed, pool } from './db.js'
import { redis } from './redis.js'
import { catalog } from './routes/catalog.js'
import { account } from './routes/account.js'

const app = new Hono().basePath('/api')
app.use('*', logger(), secureHeaders())

app.get('/health', async (c) => {
  await pool.query('SELECT 1')
  await redis.ping()
  return c.json({ ok: true })
})
app.route('/', catalog)
app.route('/', account)

app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Something went wrong on our side. Please try again.' }, 500)
})

await migrateAndSeed()
const port = Number(process.env.PORT ?? 8787)
serve({ fetch: app.fetch, port }, () => console.log(`api listening on :${port}`))
