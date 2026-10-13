import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { toast } from 'sonner'
import {
  ArrowLeft, ArrowRight, BookOpen, Check, Clock, FileQuestion, GraduationCap, Loader2, Lock, Mic, SearchX, UserRound, Wrench,
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
import { cohortStart, formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

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
              <Badge className="bg-white/70 text-letter">{c.level}</Badge>
              <Badge className="bg-white/70 text-letter">{c.track}</Badge>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-4 text-4xl leading-[1.04] font-extrabold sm:text-5xl lg:text-[3.6rem]"
            >
              {c.title}
            </motion.h1>
            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-letter-dim">{c.description}</p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-letter tabular">
              <li className="flex items-center gap-2"><Clock className="size-4 text-signal" aria-hidden />{c.durationWeeks} weeks</li>
              <li className="flex items-center gap-2"><BookOpen className="size-4 text-signal" aria-hidden />{c.lessonsCount} lessons</li>
              <li className="flex items-center gap-2"><FileQuestion className="size-4 text-signal" aria-hidden />{c.questionsCount} interview questions</li>
              <li className="flex items-center gap-2"><UserRound className="size-4 text-signal" aria-hidden />{c.instructor.name}</li>
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
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          {enrollment && (
            <div className="rounded-xl border bg-card p-5 shadow-panel">
              <h2 className="text-sm font-bold">Your progress</h2>
              <p className="mt-1 text-sm text-muted-foreground tabular">{done.size} of {lessons.length} lessons complete</p>
              <PhaseTrack done={done.size} total={lessons.length} className="mt-4" />
            </div>
          )}
          <SideNote icon={Wrench} title="Practical scenarios">
            Support tickets, rollout tasks and configuration exercises modelled on real {c.module} projects.
          </SideNote>
          <SideNote icon={Mic} title="Mock interviews">
            Two recorded 45-minute panel rounds, scored on technical depth, structure, communication and confidence.
          </SideNote>
          <SideNote icon={UserRound} title={c.instructor.name}>{c.instructor.bio}</SideNote>
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
        <Field label="Duration" value={`${c.durationWeeks} weeks`} />
        <Field label="Next cohort" value={cohortStart(c.startsAt)} className="col-span-2" />
        <div className="col-span-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Availability</span>
          {enrolled ? <Badge variant="go">Enrolled</Badge> : <StatusBadge status={c.status} />}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Full program fee</div>
            <div className="text-3xl font-extrabold tracking-tight tabular">{formatINR(c.price)}</div>
          </div>
          <span className="text-xs text-muted-foreground">demo price</span>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {['Lifetime access and question updates', 'Two mock panels with written feedback', 'Résumé review and job assistance'].map((x) => (
            <li key={x} className="flex items-center gap-2.5"><Check className="size-4 text-go" strokeWidth={3} aria-hidden />{x}</li>
          ))}
        </ul>
        {enrolled ? (
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
