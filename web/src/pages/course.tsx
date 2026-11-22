import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { toast } from 'sonner'
import {
  ArrowLeft, ArrowRight, BookOpen, BriefcaseBusiness, Check, FileQuestion, GraduationCap, ListChecks, Loader2, Lock, Mic, SearchX, UserRound, Users, Wrench,
} from 'lucide-react'
import { ModuleMark, StatusBadge } from '@/components/course/cohort'
import { DemandRamp, PhaseTrack } from '@/components/course/meta'
import { EmptyState } from '@/components/course/ghost'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { invalidate, useQuery } from '@/hooks/use-query'
import { api, type CourseDetail } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { formatINR } from '@/lib/format'
import { courseFaq, moduleGuide, trackGuide } from '@/content/course-guide'
import { inclusions, levelsFor, mentorLine, type CourseLevel } from '@/content/levels'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'

export default function CoursePage() {
  const { slug = '' } = useParams()
  const { user, ready } = useAuth()
  const { data, error, loading, setData, refetch } = useQuery(`course:${slug}:${user?.id ?? 'anon'}`, () => api.course(slug))

  if (loading && !data) return <div className="aurora h-[28rem]" />
  if (error || !data) {
    return (
      <div className="container-page py-24">
        <EmptyState icon={SearchX} title={error?.message ?? 'Course not found'}>
          <Button asChild className="mt-5"><Link to="/courses">See all courses</Link></Button>
        </EmptyState>
      </div>
    )
  }
  return <CourseView detail={data} setDetail={setData} refetch={refetch} userReady={ready} />
}

function CourseView({ detail, setDetail, refetch, userReady }: {
  detail: CourseDetail
  setDetail: (d: CourseDetail) => void
  refetch: () => Promise<void>
  userReady: boolean
}) {
  const { course: c, lessons, questions, enrollment } = detail
  const guide = moduleGuide[c.module]
  const track = trackGuide[c.track]
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [enrolling, setEnrolling] = useState(false)
  const autoEnrolled = useRef(false)

  const enrol = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${c.slug}?enrol=1`)}`)
      return
    }
    setEnrolling(true)
    try {
      await api.enroll(c.slug)
      invalidate('me:')
      await refetch()
      toast.success(`You’re enrolled in ${c.title}.`, { description: 'It’s waiting for you in My Courses.' })
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setEnrolling(false)
    }
  }

  // Coming back from login with intent to enrol.
  useEffect(() => {
    if (!userReady || !user || autoEnrolled.current || params.get('enrol') !== '1') return
    autoEnrolled.current = true
    const next = new URLSearchParams(params)
    next.delete('enrol')
    setParams(next, { replace: true })
    if (!enrollment) void enrol()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userReady, user])

  const done = new Set(enrollment?.completedLessonIds ?? [])

  const toggleLesson = async (id: string, value: boolean) => {
    if (!enrollment) return
    const prev = detail
    const ids = value ? [...done, id] : [...done].filter((x) => x !== id)
    setDetail({ ...detail, enrollment: { ...enrollment, completedLessonIds: ids } })
    try {
      await api.setLesson(id, value)
      invalidate('me:')
    } catch (e) {
      setDetail(prev)
      toast.error((e as Error).message)
    }
  }

  return (
    <>
      <section className="on-board aurora relative overflow-hidden text-letter">
        <div className="container-page grid gap-10 pt-12 pb-14 sm:pt-16 lg:grid-cols-[1fr_25rem] lg:gap-14 lg:pb-20">
          <div>
            <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-letter-dim hover:text-letter"><ArrowLeft className="size-4" aria-hidden /> All courses</Link>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge variant="module" className="bg-white/70">SAP {c.module}</Badge>
              <Badge className="bg-white/70 text-letter">Level 1 ∙ 2 ∙ 3</Badge>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-4 text-4xl leading-[1.04] font-extrabold sm:text-5xl lg:text-[3.6rem]"
            >
              {c.title}
            </motion.h1>
            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-letter-dim">{c.description}</p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-letter tabular">
              <li className="flex items-center gap-2"><BookOpen className="size-4 text-signal" aria-hidden />10 or 35 sessions</li>
              <li className="flex items-center gap-2"><Mic className="size-4 text-signal" aria-hidden />Up to 4 mock interviews</li>
              <li className="flex items-center gap-2"><FileQuestion className="size-4 text-signal" aria-hidden />Interview questionnaire</li>
              <li className="flex items-center gap-2"><UserRound className="size-4 text-signal" aria-hidden />Mentor with 8+ years’ experience</li>
            </ul>
            <DemandRamp value={c.demand} className="mt-5 text-letter-dim [&_span.bg-foreground]:bg-letter [&_.bg-foreground\/15]:bg-letter/20" />
          </div>

          <EnrolCard detail={detail} enrolling={enrolling} onEnrol={enrol} learner={user?.name} />
        </div>
        <div aria-hidden className="band-lip" />
      </section>

      <div className="container-page grid gap-14 py-16 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="min-w-0 space-y-16">
          <section aria-labelledby="overview">
            <h2 id="overview" className="text-2xl font-extrabold sm:text-3xl">Course overview</h2>
            <p className="mt-4 max-w-[68ch] text-[1.05rem] leading-relaxed text-muted-foreground">{c.overview}</p>
          </section>

          <section aria-labelledby="fit" className="grid gap-4 md:grid-cols-2">
            <h2 id="fit" className="sr-only">Who this course is for and what you need</h2>
            <div className="rounded-[1.5rem] border border-white bg-card p-6 shadow-panel">
              <h3 className="flex items-center gap-2 text-lg font-bold"><Users className="size-4 text-signal" aria-hidden />Who it’s for</h3>
              {guide && <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{guide.fit}</p>}
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                Freshers start at <span className="font-semibold text-foreground">Level 1</span>; working professionals usually join at Level 2 or 3.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white bg-card p-6 shadow-panel">
              <h3 className="flex items-center gap-2 text-lg font-bold"><ListChecks className="size-4 text-signal" aria-hidden />Before you start</h3>
              <ul className="mt-3 space-y-2">
                {track.prerequisites.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[0.95rem] text-muted-foreground">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" />{p}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <LevelCompare module={c.module} />

          <section aria-labelledby="learn">
            <h2 id="learn" className="text-2xl font-extrabold sm:text-3xl">What you will be able to do</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {c.learnPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 rounded-2xl border border-white bg-card px-4 py-3.5 shadow-panel">
                  <Check className="mt-0.5 size-4 shrink-0 text-go" strokeWidth={3} aria-hidden />
                  <span className="text-[0.95rem] font-medium">{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {guide && (
            <section aria-labelledby="tools">
              <h2 id="tools" className="text-2xl font-extrabold sm:text-3xl">Tools and transactions you’ll use</h2>
              <p className="mt-2 text-muted-foreground">You practise each of these hands-on in the system, and panels expect you to name them.</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {guide.tools.map((t) => (
                  <li key={t} className="rounded-full border border-white bg-card px-3.5 py-1.5 font-mono text-[0.8rem] shadow-panel">{t}</li>
                ))}
              </ul>
            </section>
          )}

          <Curriculum detail={detail} done={done} onToggle={toggleLesson} />


          <section aria-labelledby="questions" id="questions" className="scroll-mt-28">
            <h2 className="text-2xl font-extrabold sm:text-3xl" id="questions-h">Sample interview questions</h2>
            <p className="mt-2 text-muted-foreground">Open a question to read the model answer. The full program includes {c.questionsCount} of these.</p>
            <Accordion type="single" collapsible className="mt-6 rounded-xl border bg-card px-5 shadow-panel">
              {questions.map((x) => (
                <AccordionItem key={x.id} value={x.id}>
                  <AccordionTrigger className="gap-4 py-5 text-left text-[1rem] font-semibold hover:no-underline">
                    <span className="flex items-start gap-3">
                      <Badge variant={x.difficulty === 'Hard' ? 'call' : x.difficulty === 'Medium' ? 'quiet' : 'go'} className="mt-0.5 w-16">{x.difficulty}</Badge>
                      <span>{x.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-[5.75rem] text-[0.98rem] leading-relaxed text-muted-foreground">{x.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section aria-labelledby="faq">
            <h2 id="faq" className="text-2xl font-extrabold sm:text-3xl">Questions about this course</h2>
            <Accordion type="single" collapsible className="mt-6 rounded-xl border bg-card px-5 shadow-panel">
              {courseFaq.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="py-5 text-left text-[1rem] font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="pb-5 text-[0.98rem] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="mt-4 text-sm text-muted-foreground">
              Something else? <Link to="/contact" className="font-semibold text-signal underline-offset-4 hover:underline">Ask the team</Link>.
            </p>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          {enrollment && (
            <div className="rounded-xl border bg-card p-5 shadow-panel">
              <h2 className="text-sm font-bold">Your progress</h2>
              <p className="mt-1 text-sm text-muted-foreground tabular">{done.size} of {lessons.length} lessons complete</p>
              <PhaseTrack done={done.size} total={lessons.length} className="mt-4" />
            </div>
          )}
          {guide && (
            <div className="rounded-xl border bg-card p-5 shadow-panel">
              <h2 className="flex items-center gap-2 font-bold"><BriefcaseBusiness className="size-4" aria-hidden />Roles this prepares you for</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {guide.roles.map((r) => <li key={r} className="flex items-center gap-2"><ArrowRight className="size-3.5 text-signal" aria-hidden />{r}</li>)}
              </ul>
            </div>
          )}
          <SideNote icon={Wrench} title="Practical scenarios">
            Support tickets, rollout tasks and configuration exercises modelled on real {c.module} projects.
          </SideNote>
          <SideNote icon={Mic} title="Mock interviews">
            Two mock interviews in Level 1 and four in Level 2, each followed by a discussion of your gaps and how to fix them.
          </SideNote>
          <SideNote icon={UserRound} title="Your mentor">{mentorLine}, who works on live {c.module} projects.</SideNote>
        </aside>
      </div>
    </>
  )
}

function SideNote({ icon: Icon, title, children }: { icon: typeof Mic; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-panel">
      <h2 className="flex items-center gap-2 font-bold"><Icon className="size-4" aria-hidden />{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

function EnrolCard({ detail, enrolling, onEnrol, learner }: { detail: CourseDetail; enrolling: boolean; onEnrol: () => void; learner?: string }) {
  const { course: c, enrollment, lessons } = detail
  const options = levelsFor(c.module)
  const [levelId, setLevelId] = useState<CourseLevel['id']>(1)
  const lv = options.find((l) => l.id === levelId)!
  const enrolled = Boolean(enrollment)
  const next = lessons.find((l) => !enrollment?.completedLessonIds.includes(l.id))
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
      className="relative self-start overflow-hidden rounded-[2rem] border border-white bg-card text-foreground shadow-board"
    >
      <div className="flex items-center gap-3 p-5 pb-0">
        <ModuleMark module={c.module} index={c.catalogOrder} />
        <div className="min-w-0">
          <div className="text-xs font-semibold text-muted-foreground">SAP {c.module} program</div>
          <div className="truncate text-lg font-bold">{c.role}</div>
        </div>
      </div>
      <div className="mx-5 mt-5 grid grid-cols-2 gap-x-4 gap-y-4 rounded-[1.4rem] bg-board/70 p-4 text-sm shadow-press">
        <Field label="Learner" value={learner ?? 'You'} />
        <Field label="Sessions" value={lv.sessions ? `${lv.sessions} sessions` : 'As per topics'} />
        <div className="col-span-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Availability</span>
          {enrolled ? <Badge variant="go">Enrolled</Badge> : <StatusBadge status={c.status} />}
        </div>
      </div>

      <div className="p-5">
        <div role="radiogroup" aria-label="Choose a level" className="grid grid-cols-3 gap-1 rounded-full bg-board p-1 shadow-press">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={o.id === levelId}
              onClick={() => setLevelId(o.id)}
              className={cn('h-9 rounded-full text-sm font-semibold transition-colors', o.id === levelId ? 'bg-signal text-signal-ink shadow-panel' : 'text-letter-dim hover:bg-white/70')}
            >
              {o.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">{lv.tagline}.</span> {lv.audience}.</p>
        <div className="mt-3">
          <div className="text-xs text-muted-foreground">{lv.name} fee</div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold tracking-tight tabular">{lv.fee != null ? formatINR(lv.fee) : 'On request'}</span>
            {lv.listFee != null && lv.discount > 0 && <span className="text-muted-foreground line-through tabular">{formatINR(lv.listFee)}</span>}
            {lv.discount > 0 && lv.fee != null && <span className="rounded-full bg-go/12 px-2 py-0.5 text-xs font-bold text-go">{lv.discount}% off</span>}
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {[lv.mocks ? `${lv.mocks} mock interviews with gap discussion` : 'Mock interviews planned with your mentor', 'SAP server access and course notes', 'Résumé preparation support'].map((x) => (
            <li key={x} className="flex items-center gap-2.5"><Check className="size-4 text-go" strokeWidth={3} aria-hidden />{x}</li>
          ))}
        </ul>
        {!enrolled && lv.fee == null ? (
          <Button asChild size="lg" className="mt-5 w-full">
            <Link to={`/contact?subject=${encodeURIComponent(`SAP ${c.module} ${lv.name}`)}`}>Ask for a quote <ArrowRight /></Link>
          </Button>
        ) : enrolled ? (
          <Button asChild size="lg" className="mt-5 w-full">
            <a href="#curriculum">{next ? `Continue: lesson ${next.position}` : 'Review the curriculum'} <ArrowRight /></a>
          </Button>
        ) : (
          <Button size="lg" className="mt-5 w-full" onClick={onEnrol} disabled={enrolling}>
            {enrolling ? <><Loader2 className="animate-spin" /> Enrolling…</> : <><GraduationCap /> Enrol now</>}
          </Button>
        )}
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {enrolled ? 'You’re enrolled. Tick lessons off as you go.' : learner ? 'Free demo enrolment — no payment taken.' : 'You’ll log in or register first. It’s free.'}
        </p>
      </div>
    </motion.div>
  )
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate font-bold">{value}</div>
    </div>
  )
}

function Curriculum({ detail, done, onToggle }: { detail: CourseDetail; done: Set<string>; onToggle: (id: string, v: boolean) => void }) {
  const { lessons, enrollment } = detail
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const [pinged, setPinged] = useState<string | null>(null)
  const lastDone = lessons.reduce((acc, l, i) => (done.has(l.id) ? i : acc), -1)
  const fill = lessons.length > 1 ? Math.max(0, lastDone) / (lessons.length - 1) : 0
  const total = lessons.reduce((s, l) => s + l.minutes, 0)

  return (
    <section aria-labelledby="curriculum-h" id="curriculum" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="curriculum-h" className="text-2xl font-extrabold sm:text-3xl">Curriculum</h2>
        <span className="text-sm text-muted-foreground tabular">{lessons.length} lessons ∙ {Math.round(total / 60)} h core sessions</span>
      </div>
      {!enrollment && (
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Lock className="size-3.5" aria-hidden /> Enrol to tick off lessons and track your progress.</p>
      )}
      <ol ref={ref} className="relative mt-8">
        {/* progress line */}
        <span aria-hidden className="absolute top-3 bottom-3 left-[15px] w-[3px] rounded-full bg-foreground/10" />
        <motion.span
          aria-hidden
          className="absolute top-3 left-[15px] w-[3px] origin-top rounded-full bg-go"
          style={{ bottom: '0.75rem' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: enrollment && lastDone >= 0 ? fill : 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
        {lessons.map((l, i) => {
          const isDone = done.has(l.id)
          return (
            <motion.li
              key={l.id}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
              className="relative flex gap-5 pb-6 last:pb-0"
            >
              <button
                type="button"
                disabled={!enrollment}
                onClick={() => { onToggle(l.id, !isDone); if (!isDone) setPinged(l.id) }}
                aria-pressed={isDone}
                aria-label={enrollment ? `${isDone ? 'Mark not done' : 'Mark done'}: ${l.title}` : `Lesson ${l.position}: ${l.title}`}
                onAnimationEnd={() => setPinged(null)}
                className={cn(
                  'relative z-10 grid size-[33px] shrink-0 place-items-center rounded-full border-[3px] font-mono text-xs font-semibold transition-[background-color,border-color,color] duration-300',
                  isDone ? 'border-go bg-go text-signal-ink shadow-panel' : 'border-white bg-card text-foreground shadow-panel',
                  enrollment && !isDone && 'cursor-pointer hover:border-foreground/50',
                  pinged === l.id && 'done-ping',
                )}
              >
                {isDone ? <Check className="size-4" strokeWidth={3.2} /> : l.position}
              </button>
              <div className={cn('min-w-0 flex-1 rounded-[1.5rem] border border-white bg-card px-5 py-4 shadow-panel transition-colors duration-300', isDone && 'border-go/30 bg-mint/55')}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold">{l.title}</h3>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular">{l.minutes} min</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{l.description}</p>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}

function LevelCompare({ module }: { module: string }) {
  const options = levelsFor(module)
  return (
    <section aria-labelledby="levels-h" id="levels" className="scroll-mt-28">
      <h2 id="levels-h" className="text-2xl font-extrabold sm:text-3xl">Choose your level</h2>
      <p className="mt-2 text-muted-foreground">Same module, three depths. Start where your experience is today.</p>
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {options.map((l) => (
          <li key={l.id} className={cn('flex flex-col rounded-[1.5rem] border bg-card p-5 shadow-panel', l.id === 2 ? 'border-signal/40 ring-1 ring-signal/20' : 'border-white')}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold">{l.name}</h3>
              {l.id === 2 && <Badge variant="module">Most complete</Badge>}
            </div>
            <p className="mt-1 text-sm font-semibold">{l.tagline}</p>
            <p className="mt-1 text-sm text-muted-foreground">{l.audience}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm">
              <div><dt className="text-xs text-muted-foreground">Sessions</dt><dd className="font-bold tabular">{l.sessions ?? 'As per topics'}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Mock interviews</dt><dd className="font-bold tabular">{l.mocks ?? 'As per plan'}</dd></div>
            </dl>
            <div className="mt-auto pt-4">
              <span className="text-2xl font-extrabold tracking-tight tabular">{l.fee != null ? formatINR(l.fee) : 'On request'}</span>
              {l.listFee != null && l.discount > 0 && (
                <span className="ml-2 text-sm text-muted-foreground tabular"><span className="line-through">{formatINR(l.listFee)}</span> <span className="font-semibold text-go">{l.discount}% off</span></span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-[1.5rem] border border-white bg-card p-5 shadow-panel">
        <h3 className="font-bold">Included in every level</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {inclusions.map((x) => (
            <li key={x} className="flex items-start gap-2.5 text-[0.95rem]"><Check className="mt-0.5 size-4 shrink-0 text-go" strokeWidth={3} aria-hidden />{x}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
