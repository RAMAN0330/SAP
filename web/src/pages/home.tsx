import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView } from 'motion/react'
import {
  ArrowRight, ArrowUpRight, Award, BriefcaseBusiness, Check, ClipboardCheck, Compass, Gamepad2, GraduationCap, Layers, MessagesSquare, Quote, Server,
} from 'lucide-react'
import { TopBlogs } from '@/components/blog/top-blogs'
import { ModuleMark } from '@/components/course/cohort'
import { CourseRow } from '@/components/course/course-row'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useQuery } from '@/hooks/use-query'
import { api, type BlogSummary, type Course } from '@/lib/api'
import { formatINR } from '@/lib/format'
import { lowestFee } from '@/content/levels'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'

export default function HomePage() {
  const { data: courses = [] } = useQuery('courses', api.courses)
  const { data: stats } = useQuery('stats', api.stats)
  const { data: posts } = useQuery('blogs', api.blogs)

  return (
    <>
      <Hero posts={posts} stats={stats} />
      <Services />
      <PopularCourses courses={courses} />
      <ModuleFinder courses={courses} />
      <Stories />
      <Close />
    </>
  )
}

function Hero({ posts, stats }: { posts?: BlogSummary[]; stats?: { modules: number; lessons: number; questions: number } }) {
  return (
    <section className="on-board aurora relative overflow-hidden text-letter">
      <div className="container-page grid grid-cols-1 gap-12 pt-14 pb-10 sm:pt-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14 lg:pt-24 lg:pb-12">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-[2.6rem] leading-[1.02] font-extrabold tracking-[-0.035em] sm:text-6xl lg:text-[4.2rem]"
          >
            Walk into your SAP interview <span className="text-signal">ready.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-[34rem] text-lg leading-relaxed text-letter-dim"
          >
            Learn the SAP module that fits your background, practise on a real SAP server and rehearse with industry experts until the panel holds no surprises.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg">
              <Link to="/courses">Explore courses <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="board">
              <Link to="/interview-prep">Practise interview questions</Link>
            </Button>
            <Link to="/contact" className="ml-1 inline-flex items-center gap-1 text-sm font-semibold text-letter underline decoration-letter/30 underline-offset-4 hover:decoration-signal">
              Get job assistance <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </motion.div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-2 rounded-[1.5rem] border border-white/70 bg-white/55 p-4 text-sm shadow-panel backdrop-blur-md">
            {[
              ['Modules', stats ? String(stats.modules) : '—'],
              ['Levels', '1 ∙ 2 ∙ 3'],
              ['Mock interview', formatINR(site.mockInterview.offer)],
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
          <TopBlogs posts={posts} />
          <p className="mt-3 px-1 text-xs text-letter-dim">Hover to pause. Tap any title to read it.</p>
        </motion.div>
      </div>
      <div className="container-page pb-12 lg:pb-16">
        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="grid gap-1 rounded-[1.75rem] border border-white/70 bg-white/55 p-2 shadow-panel backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Why train with us"
        >
          {highlights.map((h) => (
            <li key={h.title} className="flex items-start gap-3.5 rounded-[1.25rem] p-4">
              <span className="sign-plate grid size-10 shrink-0 place-items-center rounded-xl">
                <h.icon className="size-[1.1rem]" strokeWidth={2.2} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-letter">{h.title}</span>
                <span className="mt-0.5 block text-sm leading-snug text-letter-dim">{h.text}</span>
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
      <div aria-hidden className="band-lip" />
    </section>
  )
}

const highlights = [
  { icon: Server, title: 'SAP server access', text: 'Practise on a real system, not slides' },
  { icon: Layers, title: 'Level 1 to Level 3', text: 'From fresher to 3 years’ experience' },
  { icon: Gamepad2, title: 'Free SAP Quiz', text: 'Your first quiz is free when you sign up' },
  { icon: Award, title: `${site.trainerYears}+ years’ experience`, text: 'Every mentor is an industry expert' },
]

const services = [
  { icon: GraduationCap, title: 'Module courses', text: 'Ten SAP modules, each in three levels, with notes and documentation you keep.', to: '/courses' },
  { icon: MessagesSquare, title: 'Interview questionnaire', text: 'Module question banks with model answers, organised the way panels actually ask.', to: '/interview-prep' },
  { icon: ClipboardCheck, title: 'Mock interviews', text: `One-hour sessions: a real round, then 30 minutes fixing your gaps. ${formatINR(site.mockInterview.offer)} for a limited period.`, to: '/interview-prep' },
  { icon: Gamepad2, title: 'SAP Quiz', text: 'Quick-fire module quizzes with explanations. Test yourself before the panel does.', to: '/quiz' },
  { icon: BriefcaseBusiness, title: 'Résumé preparation', text: 'Help shaping a résumé that matches how you interview and clears screening.', to: '/contact' },
  { icon: Compass, title: 'Career guidance', text: 'Not sure where to start? We map your background to the module and level that fit.', to: '/contact' },
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
      <ul ref={ref} className="on-board board-surface overflow-hidden rounded-[2rem] p-2 shadow-board ring-1 ring-white/70" aria-label="What we do">
        {services.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
            className="mb-1.5 last:mb-0"
          >
            <Link to={s.to} className="group flex items-center gap-4 rounded-[1.5rem] px-4 py-4 transition-[background-color,box-shadow] duration-300 hover:bg-white/80 hover:shadow-panel sm:gap-5 sm:px-5">
              <span className="sign-plate grid size-12 shrink-0 place-items-center rounded-2xl">
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

function PopularCourses({ courses }: { courses: Course[] }) {
  const featured = [...courses].sort((a, b) => b.demand - a.demand || a.catalogOrder - b.catalogOrder).slice(0, 4)
  return (
    <section className="border-y bg-band">
      <div className="container-page py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-[2.6rem]">Most in demand</h2>
            <p className="mt-3 max-w-[52ch] text-lg text-muted-foreground">The modules rated highest for hiring demand. Level 1 starts at {formatINR(lowestFee)}, now 15% off.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/courses">All {courses.length || ''} courses <ArrowRight /></Link>
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
  { id: 'finance', label: 'Finance & accounts', modules: ['FICO'] },
  { id: 'supply', label: 'Purchasing & warehouse', modules: ['MM', 'EWM'] },
  { id: 'logistics', label: 'Transport & logistics', modules: ['TM', 'EWM', 'SD'] },
  { id: 'sales', label: 'Sales & customer service', modules: ['SD'] },
  { id: 'plant', label: 'Manufacturing & quality', modules: ['PP', 'QM', 'PM'] },
  { id: 'tech', label: 'Developers & IT', modules: ['ABAP', 'BTP'] },
]

function ModuleFinder({ courses }: { courses: Course[] }) {
  const [bg, setBg] = useState('finance')
  const picked = backgrounds.find((b) => b.id === bg)!
  const bySlug = new Map(courses.map((c) => [c.module, c]))
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold sm:text-[2.6rem]">Start from where you already are.</h2>
        <p className="mt-4 text-lg text-muted-foreground">The quickest route into SAP runs through the work you already know. Choose your background to see the modules that fit it.</p>
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
            className="h-10 rounded-full border border-foreground/10 bg-card shadow-panel px-4 text-sm font-semibold data-[state=on]:border-signal data-[state=on]:bg-signal data-[state=on]:text-signal-ink"
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
              >
                <Link
                  to={`/courses/${c.slug}`}
                  className="group flex items-center gap-4 rounded-[1.5rem] border border-white bg-card p-4 shadow-panel transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <ModuleMark module={c.module} index={c.catalogOrder} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">SAP {c.module}</span>
                    <span className="block truncate text-sm text-muted-foreground">Become a {c.role}</span>
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground" aria-hidden />
                </Link>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>

    </section>
  )
}

const stories = [
  { quote: 'I knew order-to-cash from the business side but froze on pricing procedures. The scenario sessions gave me real examples to talk through, and the panel noticed.', name: 'Surendran K.', role: 'SAP SD consultant' },
  { quote: 'Walking procure-to-pay end to end, from purchase requisition to invoice verification, is what finally made my interview answers click.', name: 'Sunil Kumar', role: 'SAP MM consultant' },
  { quote: 'Years in accounts, zero SAP vocabulary. The mock interview showed me exactly where my answers went vague. I fixed those and cleared the final round.', name: 'Khusboo Parmar', role: 'SAP FICO consultant' },
  { quote: 'BTP felt too broad to prepare for. The mentor narrowed it to what interviewers actually ask, and I walked in with clear, practical answers.', name: 'Sandeep B.', role: 'SAP BTP consultant' },
  { quote: 'The coding drills were harder than the real round. By the time the panel asked about CDS views I had already explained them a dozen times.', name: 'Sunil Kumar', role: 'SAP ABAP developer' },
]

function Stories() {
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="max-w-xl text-3xl leading-tight font-extrabold sm:text-[2.6rem]">Success stories</h2>
          <p className="mt-3 max-w-[52ch] text-lg text-muted-foreground">From preparing to placed: how learners turned their background into an SAP role.</p>
        </div>
      </div>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {stories.map((s, i) => (
          <motion.li
            key={s.name + s.role}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className={cn('relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white bg-card shadow-panel', i === 1 && 'md:translate-y-6')}
          >
            <div className="flex-1 p-6">
              <span className={cn('grid size-10 place-items-center rounded-2xl shadow-[inset_0_1px_0_oklch(100%_0_0/0.7)]', ['bg-peach', 'bg-sky', 'bg-mint'][i])}><Quote className="size-5 text-foreground/60" aria-hidden /></span>
              <blockquote className="mt-3 text-[1.02rem] leading-relaxed">{s.quote}</blockquote>
            </div>
            <div className="flex items-center justify-between border-t border-dashed px-6 py-4">
              <div>
                <div className="font-bold">{s.name}</div>
                <div className="text-sm text-muted-foreground">{s.role}</div>
              </div>
              <span className="font-mono text-[0.62rem] tracking-[0.16em] text-go uppercase">Placed</span>
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
      <div ref={ref} className="on-board aurora relative grid items-center gap-10 overflow-hidden rounded-[2.5rem] px-6 py-12 shadow-board sm:px-12 sm:py-16 lg:grid-cols-[1.2fr_auto]">
        <div>
          <h2 className="max-w-2xl text-3xl leading-tight font-extrabold sm:text-5xl">Your next SAP interview is closer than you think.</h2>
          <p className="mt-4 max-w-[52ch] text-lg text-letter-dim">Create a free account, take your first SAP Quiz and find out where you stand today.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/login?mode=register">Create free account <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="board"><Link to="/quiz">Try the SAP Quiz</Link></Button>
          </div>
        </div>
        <ul className="grid gap-2.5 rounded-[1.5rem] bg-white/60 p-5 shadow-panel ring-1 ring-white/70 backdrop-blur-md" aria-label="What you get">
          {['Free account, no card needed', 'Your first SAP Quiz is free', `Level 1 from ${formatINR(lowestFee)}`].map((t, i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, x: 12 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.12, ease: EASE }}
              className="flex items-center gap-3 font-semibold"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-mint text-go"><Check className="size-4" strokeWidth={3} aria-hidden /></span>
              {t}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
