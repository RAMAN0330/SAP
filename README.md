# GoLive Academy

Interview-first SAP training platform: module courses, interview question banks, mock panels, progress tracking, referrals and contact — designed as an airport **departures board** (split-flap boards, gates, boarding passes, itineraries).

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
│       ├── components/board/ split-flap cell + live departures board (signature motion)
│       ├── components/ui/    shadcn components, restyled to the signage system
│       └── pages/            home, courses, course, login, my-courses, join-earn, blogs, blog-post, about, contact, 404
├── PLAN.md              analysis of the reference site + build plan
└── PRODUCT.md           product brief
```

## Run it (development, hot reload)

```bash
docker compose up -d postgres redis          # Postgres on :5433, Redis on :6380
cd api && npm install && npm run dev          # API on :8787 (migrates + seeds on first boot)
cd web && npm install && npm run dev          # http://localhost:5173 (proxies /api → :8787)
```

`.env.local` at the repo root holds the API's local `DATABASE_URL` / `REDIS_URL`.

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
contact email/phone/address (`web/src/config/site.ts`), course prices, lesson/question counts and instructor names (`api/src/seed/courses.ts`), the three sample learner stories (`web/src/pages/home.tsx`), referral reward amount (`api/src/routes/account.ts`), cohort departure times (generated in `api/src/routes/catalog.ts`). No payment gateway is wired — enrolment is free.
