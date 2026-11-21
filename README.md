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

## Replace before launch

Everything below is placeholder/demo and is labelled as such in the UI:
contact email/phone/address (`web/src/config/site.ts`), course prices, lesson/question counts and instructor names (`api/src/seed/courses.ts`), the three sample learner stories (`web/src/pages/home.tsx`), referral reward amount (`api/src/routes/account.ts`), cohort start times (generated in `api/src/routes/catalog.ts`), and the delivery details promised on course and Interview Prep pages: live-class schedule, practice-system access, weekly hours, interview-round guidance and FAQ answers (`web/src/content/course-guide.ts`, `web/src/pages/interview-prep.tsx`). No payment gateway is wired — enrolment is free.
