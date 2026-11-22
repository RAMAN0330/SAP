import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Check, Gamepad2, Loader2, Lock, RotateCcw, Trophy, X } from 'lucide-react'
import { ModuleMark } from '@/components/course/cohort'
import { PageIntro } from '@/components/layout/page-intro'
import { Button } from '@/components/ui/button'
import { invalidate, useQuery } from '@/hooks/use-query'
import { api, ApiError, type QuizResult, type QuizRound } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'

const letters = ['A', 'B', 'C', 'D']

export default function QuizPage() {
  const { user, ready } = useAuth()
  const { data, refetch } = useQuery(`quiz:${user?.id ?? 'anon'}`, api.quiz)
  const [round, setRound] = useState<QuizRound | null>(null)
  const [result, setResult] = useState<{ round: QuizRound; answers: number[]; result: QuizResult } | null>(null)
  const [starting, setStarting] = useState<string | null>(null)
  const status = data?.status ?? null

  const start = async (module: string) => {
    setStarting(module)
    try {
      setResult(null)
      setRound(await api.startQuiz(module))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      toast.error((e as Error).message)
      if (e instanceof ApiError && e.status === 403) void refetch()
    } finally {
      setStarting(null)
    }
  }

  const finish = (r: QuizRound, answers: number[], res: QuizResult) => {
    setRound(null)
    setResult({ round: r, answers, result: res })
    invalidate('quiz:')
    void refetch()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <PageIntro
        title={<>SAP Quiz <Gamepad2 className="inline size-10 align-[-0.15em] text-signal" aria-hidden /></>}
        lead="Ten quick questions on your module, with an explanation for every answer. Find out where you stand before an interviewer does. Your first quiz is free when you sign up."
        aside={<AccessCard ready={ready} signedIn={Boolean(user)} status={status} />}
      />

      <section className="container-page py-12 sm:py-16">
        <AnimatePresence mode="wait" initial={false}>
          {round ? (
            <motion.div key="play" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
              <Runner round={round} onQuit={() => setRound(null)} onDone={finish} />
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
              <Results {...result} onBack={() => setResult(null)} canPlay={Boolean(result.result.status.canPlay)} />
            </motion.div>
          ) : (
            <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-extrabold sm:text-3xl">Pick a module</h2>
              <p className="mt-2 text-muted-foreground">Each quiz has 10 questions and takes about five minutes.</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {!data && Array.from({ length: 6 }, (_, i) => <li key={i} className="h-[5.25rem] animate-pulse rounded-[1.5rem] bg-card" />)}
                {data?.modules.map((m, i) => {
                  const locked = !user || !status?.canPlay
                  return (
                    <li key={m.module}>
                      {user ? (
                        <button
                          type="button"
                          onClick={() => start(m.module)}
                          disabled={locked || starting !== null}
                          className="group flex w-full items-center gap-4 rounded-[1.5rem] border border-white bg-card p-4 text-left shadow-panel transition-[box-shadow,transform] duration-300 enabled:hover:-translate-y-1 enabled:hover:shadow-lift disabled:opacity-70"
                        >
                          <ModuleMark module={m.module} index={i + 1} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-bold">SAP {m.module} quiz</span>
                            <span className="block text-sm text-muted-foreground tabular">{m.best != null ? `Best score ${m.best}/${m.count}` : `${m.count} questions`}</span>
                          </span>
                          {starting === m.module ? <Loader2 className="size-4 animate-spin" /> : locked ? <Lock className="size-4 text-muted-foreground" aria-label="Locked" /> : <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden />}
                        </button>
                      ) : (
                        <Link to="/login?mode=register&redirect=/quiz" className="group flex items-center gap-4 rounded-[1.5rem] border border-white bg-card p-4 shadow-panel transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lift">
                          <ModuleMark module={m.module} index={i + 1} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-bold">SAP {m.module} quiz</span>
                            <span className="block text-sm text-muted-foreground">Sign up to play free</span>
                          </span>
                          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden />
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}

function AccessCard({ ready, signedIn, status }: { ready: boolean; signedIn: boolean; status: QuizStatus | null }) {
  let title = 'First quiz free'
  let text = 'Create a free account to play.'
  let cta: React.ReactNode = <Button asChild size="sm" className="mt-3"><Link to="/login?mode=register&redirect=/quiz">Sign up free <ArrowRight /></Link></Button>
  if (ready && signedIn && status) {
    if (status.enrolled) { title = 'Unlimited quizzes'; text = 'Included with your course.'; cta = null }
    else if (status.freeAvailable) { title = 'Your free quiz is ready'; text = 'Pick any module below.'; cta = null }
    else {
      title = 'Free quiz used'
      text = 'Unlimited quizzes come with every course.'
      cta = <Button asChild size="sm" className="mt-3"><Link to="/courses">See courses <ArrowRight /></Link></Button>
    }
  }
  return (
    <div className="max-w-xs rounded-[1.5rem] border border-white/70 bg-white/60 p-5 shadow-panel backdrop-blur-md">
      <div className="flex items-center gap-2 font-bold text-letter"><Trophy className="size-4 text-call" aria-hidden />{title}</div>
      <p className="mt-1 text-sm text-letter-dim">{text}</p>
      {cta}
    </div>
  )
}

type QuizStatus = NonNullable<import('@/lib/api').QuizOverview['status']>

function Runner({ round, onQuit, onDone }: { round: QuizRound; onQuit: () => void; onDone: (r: QuizRound, a: number[], res: QuizResult) => void }) {
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<number[]>(() => round.questions.map(() => -1))
  const [busy, setBusy] = useState(false)
  const total = round.questions.length
  const item = round.questions[i]
  const last = i === total - 1

  const choose = (k: number) => setAnswers((a) => a.map((v, j) => (j === i ? k : v)))
  const submit = async () => {
    setBusy(true)
    try {
      onDone(round, answers, await api.submitQuiz(round.module, round.attemptId, answers))
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-3 text-sm">
        <button type="button" onClick={onQuit} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden /> Quit</button>
        <span className="font-mono text-muted-foreground tabular">SAP {round.module} ∙ {i + 1} / {total}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10" aria-hidden>
        <motion.div className="h-full rounded-full bg-signal" animate={{ width: `${((i + 1) / total) * 100}%` }} transition={{ duration: 0.4, ease: EASE }} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: EASE }}
          className="mt-6 rounded-[2rem] border border-white bg-card p-6 shadow-board sm:p-8">
          <h2 className="text-xl leading-snug font-bold sm:text-2xl">{item.q}</h2>
          <div role="radiogroup" aria-label="Answer options" className="mt-6 grid gap-3">
            {item.options.map((o, k) => {
              const on = answers[i] === k
              return (
                <button key={k} type="button" role="radio" aria-checked={on} onClick={() => choose(k)}
                  className={cn('flex items-center gap-3 rounded-[1.25rem] border px-4 py-3.5 text-left transition-[background-color,border-color,box-shadow] duration-200',
                    on ? 'border-signal bg-signal/10 shadow-panel' : 'border-foreground/10 bg-card hover:border-foreground/30')}>
                  <span className={cn('grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm font-semibold', on ? 'bg-signal text-signal-ink' : 'bg-band')}>{letters[k]}</span>
                  <span className="font-medium">{o}</span>
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => setI((n) => n - 1)} disabled={i === 0}><ArrowLeft /> Back</Button>
        {last ? (
          <Button size="lg" onClick={submit} disabled={busy || answers.includes(-1)}>
            {busy ? <><Loader2 className="animate-spin" /> Scoring…</> : <>See my score <Trophy /></>}
          </Button>
        ) : (
          <Button size="lg" onClick={() => setI((n) => n + 1)} disabled={answers[i] === -1}>Next <ArrowRight /></Button>
        )}
      </div>
      {last && answers.includes(-1) && <p className="mt-2 text-right text-sm text-muted-foreground">Answer every question to see your score.</p>}
    </div>
  )
}

function Results({ round, answers, result, onBack, canPlay }: { round: QuizRound; answers: number[]; result: QuizResult; onBack: () => void; canPlay: boolean }) {
  const pct = Math.round((result.score / result.total) * 100)
  const verdict = pct >= 80 ? 'Interview-ready on the basics.' : pct >= 50 ? 'A good base, with gaps to close.' : 'Time to build the foundations.'
  return (
    <div className="mx-auto max-w-3xl">
      <div className="grid items-center gap-6 rounded-[2rem] border border-white bg-card p-6 shadow-board sm:grid-cols-[auto_1fr] sm:p-8">
        <div className="relative grid size-32 place-items-center">
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" className="stroke-foreground/10" />
            <motion.circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" strokeLinecap="round" className={pct >= 50 ? 'stroke-go' : 'stroke-call'}
              initial={{ pathLength: 0 }} animate={{ pathLength: pct / 100 }} transition={{ duration: 1, ease: EASE }} />
          </svg>
          <span className="text-3xl font-extrabold tabular">{result.score}/{result.total}</span>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">SAP {round.module}: {pct}%</h2>
          <p className="mt-1 text-lg text-muted-foreground">{verdict}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={onBack} variant="outline"><RotateCcw /> {canPlay ? 'Try another module' : 'Back to modules'}</Button>
            <Button asChild><Link to={`/courses/sap-${round.module.toLowerCase()}`}>See the {round.module} course <ArrowRight /></Link></Button>
          </div>
          {!canPlay && <p className="mt-3 text-sm text-muted-foreground">That was your free quiz. Every course includes unlimited SAP Quiz access.</p>}
        </div>
      </div>

      <h3 className="mt-10 text-xl font-bold">Review your answers</h3>
      <ol className="mt-4 space-y-3">
        {round.questions.map((x, i) => {
          const r = result.review[i]
          return (
            <li key={i} className={cn('rounded-[1.5rem] border bg-card p-5 shadow-panel', r.right ? 'border-go/30' : 'border-call/30')}>
              <div className="flex items-start gap-3">
                <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-signal-ink', r.right ? 'bg-go' : 'bg-call')}>
                  {r.right ? <Check className="size-3.5" strokeWidth={3} aria-label="Correct" /> : <X className="size-3.5" strokeWidth={3} aria-label="Wrong" />}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">{i + 1}. {x.q}</p>
                  {!r.right && answers[i] >= 0 && <p className="mt-1.5 text-sm text-muted-foreground">Your answer: <span className="line-through">{x.options[answers[i]]}</span></p>}
                  <p className="mt-1 text-sm">Correct: <span className="font-semibold">{x.options[r.correct]}</span></p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.why}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
