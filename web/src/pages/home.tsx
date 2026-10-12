import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView } from 'motion/react'
import {
  ArrowRight, ArrowUpRight, BadgeCheck, BriefcaseBusiness, ClipboardCheck, Compass, GraduationCap, LineChart, MessagesSquare, Quote,
} from 'lucide-react'
import { LiveBoard } from '@/components/board/departure-board'
import { FlapText } from '@/components/board/split-flap'
import { CourseRow } from '@/components/course/course-row'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useQuery } from '@/hooks/use-query'
import { api, type Course } from '@/lib/api'
import { formatNumber, gateCode } from '@/lib/format'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

export default function HomePage() {
  const { data: courses = [] } = useQuery('courses', api.courses)
  const { data: stats } = useQuery('stats', api.stats)

  return (
    <>
      <Hero courses={courses} stats={stats} />
      <Services />
      <Departures courses={courses} />
      <ModuleFinder courses={courses} />
      <Approach />
      <Stories />
      <Close />
    </>
  )
}

function Hero({ courses, stats }: { courses: Course[]; stats?: { modules: number; lessons: number; questions: number } }) {
  return (
    <section className="on-board board-surface relative overflow-hidden text-letter">
      <div className="container-page grid gap-12 pt-14 pb-12 sm:pt-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14 lg:pt-24 lg:pb-20">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-[2.6rem] leading-[1.02] font-extrabold tracking-[-0.035em] sm:text-6xl lg:text-[4.2rem]"
          >
            Your SAP career has a <span className="text-signal">departure time.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-[34rem] text-lg leading-relaxed text-letter-dim"
          >
            Pick the module your experience already speaks, train for the panel rather than the manual, and walk into the interview ready.
            Courses, question banks, mock rounds and placement help — scheduled like a go-live.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg">
              <Link to="/courses">Find your gate <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="board">
              <Link to="/courses/sap-fico#questions">Practise interview questions</Link>
            </Button>
            <Link to="/contact" className="ml-1 inline-flex items-center gap-1 text-sm font-semibold text-letter underline decoration-letter/30 underline-offset-4 hover:decoration-signal">
              Get job assistance <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </motion.div>

          <dl className="mt-12 grid max-w-md grid-cols-3 border-t border-white/10 pt-5 text-sm">
            {[
              ['Modules', stats ? String(stats.modules) : '—'],
              ['Questions', stats ? formatNumber(stats.questions) : '—'],
              ['Mock panel', `${site.mockBatch.day} ${site.mockBatch.time}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[0.62rem] tracking-[0.16em] text-letter-dim uppercase">{k}</dt>
                <dd className="mt-1 text-lg font-bold tabular text-letter">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          style={{ transformPerspective: 1400 }}
        >
          <LiveBoard courses={courses} />
          <p className="mt-3 px-1 text-xs text-letter-dim">Cohort times are sample schedules in IST. Tap any row to see the course.</p>
        </motion.div>
      </div>
    </section>
  )
}

const services = [
  { icon: MessagesSquare, title: 'Interview preparation', text: 'Module question banks with model answers, organised the way panels actually ask.', to: '/courses' },
  { icon: GraduationCap, title: 'Module courses', text: 'Configuration-first training across 18 SAP modules, taught as project work.', to: '/courses' },
  { icon: ClipboardCheck, title: 'Mock interviews', text: 'Recorded panel rounds scored on a written rubric, with a plan for what to fix.', to: '/contact' },
  { icon: BriefcaseBusiness, title: 'Job assistance', text: 'Résumé rebuilds, profile positioning and introductions to hiring partners.', to: '/contact' },
  { icon: Compass, title: 'Career guidance', text: 'A one-to-one session mapping your background to the module with the best odds.', to: '/contact' },
  { icon: LineChart, title: 'Progress tracking', text: 'Every lesson and question set tracked, so you always know what is left.', to: '/my-courses' },
]

function Services() {
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  return (
    <section className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-3xl leading-tight font-extrabold sm:text-[2.6rem]">Everything between learning SAP and the offer letter.</h2>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
          Most training stops at configuration. We keep going: through the questions, the mock panel, the résumé and the introductions — one route, clearly signposted.
        </p>
      </div>
      <ul ref={ref} className="on-board board-surface overflow-hidden rounded-xl shadow-board ring-1 ring-black/5" aria-label="What we do">
        {services.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
            className="border-b border-white/[0.07] last:border-b-0"
          >
            <Link to={s.to} className="group flex items-center gap-4 px-5 py-5 transition-colors duration-300 hover:bg-white/[0.04] sm:gap-5 sm:px-7">
              <span className="sign-plate grid size-11 shrink-0 place-items-center rounded-md">
                <s.icon className="size-5" strokeWidth={2.2} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-letter">{s.title}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-letter-dim">{s.text}</span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-letter-dim transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-signal" aria-hidden />
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

function Departures({ courses }: { courses: Course[] }) {
  const featured = [...courses].sort((a, b) => b.demand - a.demand || a.gate - b.gate).slice(0, 4)
  return (
    <section className="border-y bg-[oklch(95.2%_0.009_264)]">
      <div className="container-page py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-[2.6rem]">Departing soon</h2>
            <p className="mt-3 max-w-[52ch] text-lg text-muted-foreground">The modules rated highest for hiring demand. Each program bundles lessons, a question bank, scenarios and mock rounds.</p>
            <p className="mt-2 text-xs text-muted-foreground">Departure times, fares and demand ratings are sample data.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/courses">All 18 gates <ArrowRight /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-4">
          {featured.length
            ? featured.map((c, i) => <CourseRow key={c.slug} course={c} index={i} />)
            : Array.from({ length: 4 }, (_, i) => <div key={i} className="h-44 animate-pulse rounded-xl bg-card" />)}
        </div>
      </div>
    </section>
  )
}

const backgrounds = [
  { id: 'finance', label: 'Finance & accounts', modules: ['FICO', 'BW/4HANA', 'S/4HANA'] },
  { id: 'supply', label: 'Purchasing & supply chain', modules: ['MM', 'Ariba', 'EWM', 'WM'] },
  { id: 'sales', label: 'Sales & customer service', modules: ['SD', 'S/4HANA'] },
  { id: 'hr', label: 'HR & payroll', modules: ['HCM', 'SuccessFactors'] },
  { id: 'plant', label: 'Manufacturing & quality', modules: ['PP', 'QM', 'PM'] },
  { id: 'tech', label: 'Developers & IT', modules: ['ABAP', 'BTP', 'CPI', 'Basis', 'Security'] },
]

function ModuleFinder({ courses }: { courses: Course[] }) {
  const [bg, setBg] = useState('finance')
  const picked = backgrounds.find((b) => b.id === bg)!
  const bySlug = new Map(courses.map((c) => [c.module, c]))
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold sm:text-[2.6rem]">Start from where you already are.</h2>
        <p className="mt-4 text-lg text-muted-foreground">The quickest route into SAP runs through the work you already know. Choose your background to see the gates that fit it.</p>
      </div>

      <ToggleGroup
        type="single"
        value={bg}
        onValueChange={(v) => v && setBg(v)}
        className="mt-8 flex w-full flex-wrap justify-start gap-2"
        aria-label="Your background"
      >
        {backgrounds.map((b) => (
          <ToggleGroupItem
            key={b.id}
            value={b.id}
            className="h-10 rounded-md border border-foreground/15 bg-card px-4 text-sm font-semibold data-[state=on]:border-board data-[state=on]:bg-board data-[state=on]:text-letter"
          >
            {b.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <motion.ul layout className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {picked.modules.map((m, i) => {
            const c = bySlug.get(m)
            if (!c) return null
            return (
              <motion.li
                key={`${bg}-${m}`}
                layout
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
              >
                <Link
                  to={`/courses/${c.slug}`}
                  className="group flex items-center gap-4 rounded-xl border bg-card p-4 shadow-panel transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-foreground/30"
                >
                  <span className="on-board board-surface rounded-md px-2 py-1.5 text-[17px]">
                    <FlapText text={gateCode(c.gate)} length={3} tone="signal" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">SAP {c.module}</span>
                    <span className="block truncate text-sm text-muted-foreground">To: {c.destination}</span>
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground" aria-hidden />
                </Link>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>

      <div className="mt-10 border-t pt-6">
        <p className="text-sm font-semibold">Every module</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {courses.map((c) => (
            <li key={c.slug}>
              <Link to={`/courses/${c.slug}`} className="inline-flex items-center gap-1.5 rounded-md border border-foreground/12 bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-foreground/40">
                <span className="font-mono text-[0.7rem] text-muted-foreground">{gateCode(c.gate)}</span> SAP {c.module}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const checklist = [
  { title: 'Real project scenarios', text: 'Incidents, change requests and rollout tasks modelled on live landscapes.' },
  { title: 'Mentors who practise', text: 'Taught by consultants currently delivering SAP work, not by slide readers.' },
  { title: 'Every lesson ends in a question', text: 'Each topic closes with the interview question it prepares you for.' },
  { title: 'Question banks that keep moving', text: 'Updated as release cycles and interview patterns shift.' },
]

function Approach() {
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  return (
    <section className="border-y bg-[oklch(95.2%_0.009_264)]">
      <div className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="text-3xl leading-tight font-extrabold sm:text-[2.6rem]">Built from the interview room backwards.</h2>
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
            Our mentors sit on hiring panels. The curriculum starts from what they screen for and works back to the configuration you need to answer it — not the other way round.
          </p>
          <Button asChild variant="outline" className="mt-8">
            <Link to="/about">How we teach <ArrowRight /></Link>
          </Button>
        </div>
        <ol ref={ref} className="rounded-xl border bg-card p-2 shadow-panel" aria-label="Pre-flight checklist">
          {checklist.map((item, i) => (
            <li key={item.title} className="flex gap-4 rounded-lg p-4 sm:p-5">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : undefined}
                transition={{ type: 'spring', stiffness: 500, damping: 26, delay: 0.15 + i * 0.18 }}
                className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-go/20 text-[oklch(38%_0.11_155)]"
              >
                <BadgeCheck className="size-4.5" strokeWidth={2.4} aria-hidden />
              </motion.span>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1 text-[0.95rem] text-muted-foreground">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const stories = [
  { quote: 'Eight years in accounts payable, zero SAP vocabulary. The mock panel showed me exactly where my answers went vague. I fixed those and cleared round three.', name: 'Priya R.', role: 'FICO consultant ∙ Chennai' },
  { quote: 'I knew purchasing inside out but not how it lands in the system. Walking the procure-to-pay flow end to end is what finally made my interview answers click.', name: 'Karthik M.', role: 'MM analyst ∙ Bengaluru' },
  { quote: 'The live coding drills were harder than the real round. By the time the panel asked me about CDS views I had already explained them a dozen times.', name: 'Ayesha K.', role: 'ABAP developer ∙ Hyderabad' },
]

function Stories() {
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-xl text-3xl leading-tight font-extrabold sm:text-[2.6rem]">From preparing to placed.</h2>
        <p className="rounded-md border border-dashed border-foreground/25 px-3 py-1.5 text-xs font-semibold text-muted-foreground">Sample stories — replace with real learner quotes before launch</p>
      </div>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {stories.map((s, i) => (
          <motion.li
            key={s.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className={cn('relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-panel', i === 1 && 'md:translate-y-6')}
          >
            <div className="flex-1 p-6">
              <Quote className="size-6 text-foreground/25" aria-hidden />
              <blockquote className="mt-3 text-[1.02rem] leading-relaxed">{s.quote}</blockquote>
            </div>
            <div className="flex items-center justify-between border-t border-dashed px-6 py-4">
              <div>
                <div className="font-bold">{s.name}</div>
                <div className="text-sm text-muted-foreground">{s.role}</div>
              </div>
              <span className="font-mono text-[0.68rem] tracking-[0.14em] text-[oklch(38%_0.11_155)] uppercase">Landed</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

function Close() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <section className="container-page pt-8 pb-24">
      <div ref={ref} className="on-board board-surface relative grid items-center gap-10 overflow-hidden rounded-2xl px-6 py-12 shadow-board sm:px-12 sm:py-16 lg:grid-cols-[1.2fr_auto]">
        <div>
          <h2 className="max-w-2xl text-3xl leading-tight font-extrabold sm:text-5xl">Your next SAP interview is a flight you can catch.</h2>
          <p className="mt-4 max-w-[52ch] text-lg text-letter-dim">Create a free account, choose your module and start on real interview questions today.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/login?mode=register">Create free account <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="board"><Link to="/join-earn">Join &amp; Earn</Link></Button>
          </div>
        </div>
        <dl className="grid gap-2 rounded-xl bg-black/20 p-4 text-[14px] ring-1 ring-white/10 sm:text-[17px]" aria-label="Gate status">
          {[['GATE', 'ANY', 'letter'], ['STATUS', 'BOARDING', 'go'], ['TO', 'YOUR OFFER', 'letter']].map(([k, v, tone], i) => (
            <div key={k} className="flex items-center justify-between gap-6">
              <dt className="font-mono text-[0.62rem] tracking-[0.16em] text-letter-dim">{k}</dt>
              <dd><FlapText text={v} length={10} tone={tone as 'letter' | 'go'} align="right" delay={i * 140} stagger={40} active={inView} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
