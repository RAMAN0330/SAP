# SAP interview-prep platform — build plan

Reference analysed: https://sap-career-ace.lovable.app (structure, components, behaviour and visual system).
All copy, course data, blog articles and imagery in this build are original.

## 1. What the reference site is

| Area | Finding |
|---|---|
| Stack | React SPA, TanStack Router, React Query, Tailwind (oklch tokens), lucide icons, Plus Jakarta Sans |
| Backend | Supabase (Lovable Cloud) — tables `courses`, `course_lessons`, `interview_questions`, `blog_posts`; Supabase email/password auth |
| Routes | `/`, `/courses`, `/courses/:slug`, `/blogs`, `/blogs/:slug`, `/about`, `/contact`, `/my-courses`, `/join-earn`, `/login` |
| Visual system | White base, navy→blue diagonal gradient page heroes, indigo primary, slate muted text, 14px radius, rounded-2xl cards with two-layer soft shadow, uppercase tracked "eyebrow" labels, pill chips |

### Component inventory
- **Navbar** — logo (cap icon in indigo circle + two-tone wordmark), 7 links with pill-shaped active state, Login button / user menu; hamburger drawer on mobile.
- **Footer** — 4 columns (brand blurb, Platform, Company, Get in touch with icons) + copyright bar.
- **PageHero** — gradient band with H1 + lead paragraph (used by Courses, Blogs, About, Contact, Join & Earn).
- **SectionHeading** — eyebrow + H2 + lead, centred or left.
- **CourseCard** — gradient header ("SAP MODULE" + module name + layers icon), level/duration badges, title, description, 2×2 meta grid (lessons, questions, weeks, level), divider, ₹ price + "Enrol Now".
- **FeatureCard** — icon tile + title + body (services, why-us, values, referral steps).
- **TestimonialCard** — quote icon, text, name, role, 5 stars.
- **CTA band** — rounded gradient panel with two buttons.
- **Course detail** — hero with module chip, meta row, floating price card (checklist + enrol + "login required"); overview, learn-points grid, numbered curriculum, sample-question accordion; sidebar cards (scenarios, mocks, instructor).
- **Blog list** — search + category chips + post cards (category badge, title, excerpt, author, date).
- **Forms** — contact form (required fields), login/register tabs.

### Behaviour
- Courses: client-side search (title/module) + level filter.
- Blogs: search + category filter.
- Enrol: requires login → redirect to `/login?redirect=…`, then enrols.
- My Courses: auth-gated; empty/guest states.
- Join & Earn: guests see steps + sign-up prompt; members get a referral code.

## 2. Build approach (as built)

- **Brand:** GoLive Academy (user delegated the name). All copy, course data, Q&A and articles are original.
- **Design:** Impeccable direction round → user chose **Departure Board**: split-flap boards, gates, boarding passes, itineraries; signal-yellow actions, BOARDING/FINAL CALL status colours, Overpass + Overpass Mono.
- **Frontend:** Vite + React 19 + TypeScript, Tailwind v4, **shadcn/ui** (radix) restyled to the signage system, **Motion** for layout/page/route animation, custom CSS 3D split-flap cells.
- **Backend:** Docker Compose with **postgres:17-alpine** and **redis:7-alpine**; Hono API with `pg` + `ioredis`. Redis holds sessions, catalogue cache, rate limits and a contact-notification queue.
- **Auth:** scrypt-hashed passwords, opaque session id in an httpOnly cookie → Redis.

### Reference → build mapping
| Reference component | Built as |
|---|---|
| Gradient hero + photo | Headline + live split-flap departures board (IST clock, cycles 18 modules) |
| "What we do" icon cards | Wayfinding sign panel (list of signs with arrows) |
| Course cards | Departure rows: board stub (gate, date, status flaps) + details + fare |
| Module pills | "Start from where you already are" background picker + module index |
| Why-us cards | Pre-flight checklist |
| Testimonials | Sample stories, clearly labelled as placeholders |
| Course detail price card | Boarding pass that flips to BOARDED on enrolment |
| Curriculum list | Itinerary with route line, tickable stops, progress phases |
| Login tabs | Check-in desk (blueprint-diagram styling per user reference) |
| My Courses / Join & Earn | Trips with phase track · referral code on a flap board, copy link, friends, earnings |

## 3. Steps (done)
1. Scraped all routes (text, links, forms, API calls, CSS tokens, screenshots).
2. Product brief (PRODUCT.md) + visual direction decision.
3. Docker Postgres/Redis, API with schema + seed + routes, smoke-tested.
4. shadcn init, theme tokens, split-flap system, layout, all pages.
5. Verified: typecheck, production build, Playwright screenshots desktop + mobile on every route, register → enrol → tick lessons flow, no console errors or horizontal overflow.
