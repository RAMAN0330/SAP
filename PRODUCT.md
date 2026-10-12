# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

User-confirmed: Vite + React + TypeScript web app using shadcn/ui and Tailwind v4, with "the finest animations" (Motion for React). Backend runs in Docker: PostgreSQL (alpine) for data and Redis (alpine) for sessions/caching/rate limits, behind a Node API. Choice of API framework was delegated: Hono on Node (small, typed, fast) with `pg` and `ioredis`.

## Users

Confirmed primary visitors, all three equally:
- **Freshers entering SAP** — graduates or early-career people choosing their first module and needing to know what interviews look like.
- **Career switchers** — accountants, supply-chain, HR and ops professionals translating domain experience into an SAP consulting role.
- **Working SAP consultants** — changing modules or targeting S/4HANA / cloud roles, short on time, wanting interview-grade depth fast.

Their job: pick the right SAP module, prepare specifically for how SAP interview panels run, and get in front of hiring partners.

## Product Purpose

An interview-first SAP training platform: module courses, question banks with model answers, panel-style mock interviews, and job assistance in one place. Success = a learner enrols, works through lessons and questions with visible progress, and walks into a real interview prepared.

## Positioning

Training reverse-engineered from the SAP interview itself rather than from configuration manuals: every lesson ends in the question a panel would ask, and mock rounds are scored on a written rubric. (Inferred from the reference product analysed; confirm before publishing marketing claims.)

## Operating Context

Visitors browse courses by module and level, read career articles, register, enrol, track lesson completion, invite friends with a referral code (Join & Earn), and contact the team. Prices in INR. India-based audience; IST schedules.

## Capabilities and Constraints

- Routes: Home, All Courses (search + level filter), Course detail (curriculum, sample questions, enrol), Blogs (search + category), Blog post, About, Contact (form), My Courses (auth-gated, progress), Join & Earn (referral code), Login/Register.
- Real auth (hashed passwords, Redis-backed sessions), enrolments, lesson progress, referrals, contact messages persisted in Postgres.
- Undecided: payments (enrolment is free/mock — no payment gateway), email delivery, real instructor identities.

## Brand Commitments

- Name: **GoLive Academy** (delegated by user: "any other best for SAP"). "Go-live" is the SAP project milestone; it doubles as the learner's career go-live.
- Must not imitate the reference site's brand, copy or imagery; all content is original.

## Evidence on Hand

None real. No real testimonials, learner counts, placement rates, instructors, partner companies or contact details exist. Any such content shipped is a clearly labelled placeholder on the replacement list; course prices and stats are demo data.

## Product Principles

1. Interview-first: every surface points toward the moment in the interview room.
2. Honest proof: never present invented outcomes as real.
3. Module clarity: a visitor should find their module in two clicks.
4. Progress is visible: learners always see what is done and what is left.

## Accessibility & Inclusion

WCAG 2.2 AA; full keyboard support; respect `prefers-reduced-motion` (motion is rich but never required to read content).
