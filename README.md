# Config2Consult

Interview-first SAP training platform: module courses, interview question banks, mock panels, progress tracking, referrals and contact. Light, airy interface (Figtree + Overpass Mono, soft blue aurora backgrounds, pastel module marks); the full visual system is in `DESIGN.md`.

```
SAP/
├── docker-compose.yml   postgres:17-alpine · redis:7-alpine · api · web (nginx)
├── api/                 Hono + pg + ioredis (TypeScript)
│   └── src/
│       ├── schema.sql        tables, run idempotently on boot
│       ├── seed/             18 courses, 9-stop itineraries, Q&A, 6 articles (demo content)
│       ├── auth.ts           scrypt password hashing, Redis sessions (httpOnly cookie)
│       └── routes/           catalog (cached in Redis) · account (auth, enrol, progress, referrals, contact)
├── web/                 Vite + React 19 + Tailwind v4 + shadcn/ui + Motion
│   └── src/
│       ├── components/       layout, course, blog and brand components; ui/ holds restyled shadcn components
│       ├── content/          static page content (course prerequisites, tools, roles, FAQ) — edit without a DB change
│       └── pages/            home, courses, course, interview-prep, login, my-courses, join-earn, blogs, blog-post, about, contact, 404
├── DESIGN.md            design tokens and component rules
├── PLAN.md              analysis of the reference site + original build plan
└── PRODUCT.md           product brief
```

## Run it (development, hot reload)

```bash
docker compose up -d postgres redis          # Postgres on :5433, Redis on :6380
cd api && npm install && npm run dev          # API on :8787 (migrates + seeds on first boot)
cd web && npm install && npm run dev          # http://localhost:5173 (proxies /api → :8787)
```

Copy `.env.local.example` to `.env.local` at the repo root first; it holds the API's local `DATABASE_URL` / `REDIS_URL` and is not committed.

New blog articles added to `api/src/seed/blogs.ts` are inserted on the next API boot (matched by slug; existing posts are never changed). Courses, lessons and questions are seeded only into an empty database.

## Run the whole stack in Docker

```bash
docker compose --profile full up -d --build   # web on http://localhost:8088
```

For plain-HTTP local use of the containerised stack, set `INSECURE_COOKIES=1` on the `api` service (production cookies are `Secure`).

## API

| Method | Path | Notes |
|---|---|---|
| GET | `/api/courses`, `/api/courses/:slug` | catalogue (Redis-cached 5 min); detail includes lessons, questions, your enrolment |
| GET | `/api/stats`, `/api/blogs`, `/api/blogs/:slug` | |
| POST | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` · GET `/api/auth/me` | rate-limited via Redis |
| POST | `/api/courses/:slug/enroll` | auth |
| PUT | `/api/lessons/:id/progress` `{ done }` | auth, must be enrolled |
| GET | `/api/me/enrollments`, `/api/me/referrals` | auth |
| POST | `/api/contact` | rate-limited, also queued to `queue:contact-notify` in Redis |

## Business content

- Courses on sale: `offeredSlugs` in `api/src/seed/courses.ts` (others stay in the database, hidden). Changing the list takes effect on the next API boot.
- Levels, fees and what every level includes: `web/src/content/levels.ts` (same for every module; per-module overrides go in `levelOverrides`).
- Mock interview price and offer: `site.mockInterview` in `web/src/config/site.ts`.
- SAP Quiz questions: `api/src/seed/quiz.ts`. Every account gets one free quiz; enrolment in any course unlocks unlimited quizzes.
- Contact details: `web/src/config/site.ts`.

## SAP news auto-blog

The API publishes SAP technology news to the blog on its own, under the category **SAP News** (`api/src/news.ts`).

- **Sources:** SAP News Center and diginomica (only feeds whose robots rules allow automated reading). Add more in `feeds`.
- **Nothing is written by AI.** Each post uses the publisher's own headline and summary, credits the publisher as the author, and links to the full article.
- **Filtering:** items must mention SAP (or an SAP product) unless the feed is SAP's own, must be about work or technology, and are dropped if they are about sport, sponsorship, charity or lifestyle. Items older than 7 days are skipped.
- **Dedup:** the same article URL is never posted twice, and a story whose headline matches one posted in the last 60 days (from any outlet) is skipped.
- **Schedule:** a run 30 seconds after the API starts, then every 6 hours, at most 5 posts per run.

Settings (on the `api` service or in the server's `.env`): `NEWS_INTERVAL_HOURS` (default 6, `0` turns it off), `NEWS_MAX_PER_RUN` (default 5), `NEWS_MAX_AGE_DAYS` (default 7). To remove a post: `DELETE FROM blog_posts WHERE slug = '…';`

## Email OTP (sign-up and login codes)

New accounts confirm their email with a 6-digit code, and anyone can log in with an emailed code instead of a password. It switches on when SMTP credentials are set; without them, sign-up works with a password only.

To turn it on with Gmail (free, about 500 emails a day):
1. On the Gmail account, turn on 2-Step Verification, then create an **app password** (Google Account → Security → App passwords).
2. In GitHub → Settings → Secrets and variables → Actions, add `SMTP_USER` (the Gmail address) and `SMTP_PASS` (the app password). The deploy passes them to the API. Alternatively put them in the server's `.env`.
3. Redeploy. `GET /api/auth/config` returns `{"emailOtp": true}` once it is on.

Locally, `OTP_DEV_LOG=1` in `.env.local` prints codes to the API console instead of sending email.

## Still to confirm or replace

Course topics per module (owner to send), Level 3 pricing (shown as "On request"), office hours, the success-story quotes on the home page (illustrative until real learner quotes are available), interview-question counts per course, cohort start times (generated in `api/src/routes/catalog.ts`). No payment gateway is wired yet, so enrolment is free.
