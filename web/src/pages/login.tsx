import { useState, type ComponentProps, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import {
  ArrowRight, Eye, EyeOff, KeyRound, Loader2, Lock, Mail, PlaneLanding, Route, TicketCheck, Ticket, UserPlus, UserRound,
  type LucideIcon,
} from 'lucide-react'
import { FlapText } from '@/components/board/split-flap'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const safeRedirect = (r: string | null) => (r && r.startsWith('/') && !r.startsWith('//') ? r : '/my-courses')

type Mode = 'login' | 'register'

/* Diagram inks — one per phase, used for header pills, nodes and legend alike. */
const PHASES = [
  { key: 'checkin', label: 'Check-in', sub: 'free account', icon: UserPlus, ink: 'text-signal', border: 'border-signal', fill: 'bg-[oklch(27%_0.05_85/0.55)]', swatch: 'bg-[oklch(27%_0.05_85)] border-signal' },
  { key: 'boarding', label: 'Boarding', sub: 'pick a gate', icon: TicketCheck, ink: 'text-go', border: 'border-go', fill: 'bg-[oklch(26%_0.05_160/0.6)]', swatch: 'bg-[oklch(26%_0.05_160)] border-go' },
  { key: 'flight', label: 'In flight', sub: 'tick stops', icon: Route, ink: 'text-letter', border: 'border-letter/70', fill: 'bg-[oklch(28%_0.03_266/0.6)]', swatch: 'bg-[oklch(28%_0.03_266)] border-letter/70' },
  { key: 'landed', label: 'Landed', sub: 'the offer', icon: PlaneLanding, ink: 'text-call', border: 'border-call', fill: 'bg-[oklch(27%_0.05_50/0.55)]', swatch: 'bg-[oklch(27%_0.05_50)] border-call' },
] as const

export default function LoginPage() {
  const [params, setParams] = useSearchParams()
  const { user, ready } = useAuth()
  const mode: Mode = params.get('mode') === 'register' ? 'register' : 'login'
  const redirect = safeRedirect(params.get('redirect'))

  if (ready && user) return <Navigate to={redirect} replace />

  const setMode = (m: Mode) => {
    const next = new URLSearchParams(params)
    if (m === 'register') next.set('mode', 'register')
    else next.delete('mode')
    setParams(next, { replace: true })
  }

  return (
    <section className="on-board bg-grid relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="container-page grid gap-12 py-12 sm:py-16 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-14 lg:py-16">
        <Intro mode={mode} />
        <Diagram mode={mode} setMode={setMode} redirect={redirect} initialRef={params.get('ref') ?? ''} />
      </div>
    </section>
  )
}

function Intro({ mode }: { mode: Mode }) {
  return (
    <div className="lg:sticky lg:top-28 lg:pt-12">
      <h1 className="max-w-md text-4xl leading-[1.04] font-extrabold sm:text-5xl">Welcome to the check-in desk</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-letter-dim">
        One account for your courses, progress and referral rewards. Log in, or create a free account to enrol.
      </p>
      <ul className="mt-8 hidden space-y-3 text-letter-dim sm:block">
        {['Enrol in any module and track every stop', 'Practise with the full question bank', 'Get a referral code the moment you register'].map((t) => (
          <li key={t} className="flex items-center gap-3">
            <span className="grid size-5 place-items-center rounded-sm bg-signal/15 text-signal"><ArrowRight className="size-3" aria-hidden /></span>
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-10 hidden items-center gap-4 rounded-lg border border-white/10 bg-black/20 p-3 sm:inline-flex">
        <span className="font-mono text-[0.62rem] tracking-[0.16em] text-letter-dim uppercase">Desk status</span>
        <span className="text-[17px]">
          <FlapText text={mode === 'register' ? 'NEW PASSENGER' : 'CHECK-IN OPEN'} length={13} tone={mode === 'register' ? 'go' : 'signal'} stagger={40} />
        </span>
      </div>
      <p className="mt-5 hidden max-w-md font-mono text-[0.7rem] leading-relaxed text-letter-dim sm:block">passwords hashed with scrypt ∙ sessions held server-side ∙ expire after 7 days</p>
    </div>
  )
}

function Diagram({ mode, setMode, redirect, initialRef }: { mode: Mode; setMode: (m: Mode) => void; redirect: string; initialRef: string }) {
  const here = 0 // a visitor on this page hasn't started a course yet

  return (
    <div className="relative">
      {/* column headers, aligned with the route nodes below */}
      <ol className="mb-4 hidden grid-cols-4 gap-6 px-[1.6rem] sm:grid" aria-hidden>
        {PHASES.map((p) => (
          <li key={p.key} className={cn('rounded-md bg-black/25 py-1.5 text-center font-mono text-[0.78rem] font-semibold', p.ink)}>{p.label}</li>
        ))}
      </ol>

      {/* Lane 01 */}
      <Lane index="01" label="Check-in desk">
        <motion.div
          layout
          transition={{ duration: 0.4, ease: EASE }}
          className={cn(
            'relative mx-auto w-full max-w-[34rem] rounded-xl border-2 p-5 transition-[border-color,background-color,box-shadow] duration-500 sm:p-7',
            mode === 'register'
              ? 'border-go bg-[oklch(22%_0.045_165/0.85)] shadow-[0_2px_4px_oklch(10%_0.05_268/0.4),0_30px_70px_-28px_oklch(78%_0.17_155/0.4)]'
              : 'border-signal bg-[oklch(22%_0.04_85/0.6)] shadow-[0_2px_4px_oklch(10%_0.05_268/0.4),0_30px_70px_-28px_oklch(85%_0.165_86/0.35)]',
          )}
        >
          <span className={cn('absolute top-4 left-4 grid size-8 place-items-center rounded-md', mode === 'register' ? 'bg-go/15 text-go' : 'bg-signal/15 text-signal')}>
            {mode === 'register' ? <UserPlus className="size-4" aria-hidden /> : <KeyRound className="size-4" aria-hidden />}
          </span>
          <div className="text-center">
            <h2 className="font-mono text-lg font-semibold text-letter">{mode === 'register' ? 'Create account' : 'Passenger login'}</h2>
            <p className="mt-0.5 font-mono text-[0.75rem] text-letter-dim">{mode === 'register' ? 'name + email + password' : 'email + password'}</p>
          </div>

          <ModeSwitch mode={mode} setMode={setMode} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'register' ? 18 : -18, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-6"
            >
              {mode === 'login' ? <LoginForm redirect={redirect} /> : <RegisterForm redirect={redirect} initialRef={initialRef} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Lane>

      {/* edge between lanes */}
      <div className="relative flex h-16 justify-center" aria-hidden>
        <span className={cn('dash-flow-y h-full w-[2px]', mode === 'register' ? 'text-go' : 'text-signal')} />
        <svg viewBox="0 0 12 8" className={cn('absolute bottom-0 h-2 w-3', mode === 'register' ? 'text-go' : 'text-signal')}><path d="M0 0l6 8 6-8z" fill="currentColor" /></svg>
        <span className="absolute top-1/2 left-1/2 ml-3 -translate-y-1/2 rounded-sm bg-board px-2 py-0.5 font-mono text-[0.72rem] text-letter">on success</span>
      </div>

      {/* Lane 02 */}
      <Lane index="02" label="Your route">
        <ol className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 sm:gap-x-6" aria-label="Your route: check-in, boarding, in flight, landed">
          {PHASES.map((p, i) => (
            <li key={p.key} className="relative">
              <RouteNode phase={p} active={i === here} delay={0.15 + i * 0.08} />
              {i < PHASES.length - 1 && (
                <svg aria-hidden viewBox="0 0 24 10" className={cn('absolute top-1/2 -right-[30px] z-10 h-2.5 w-7 -translate-y-1/2 text-letter-dim sm:-right-[23px] sm:w-[22px]', i === 1 ? 'hidden sm:block' : 'block')}>
                  <path d="M0 5h18" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" className="dash-travel" />
                  <path d="M17 1l6 4-6 4z" fill="currentColor" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </Lane>

      <p className="mt-8 text-center text-sm text-letter-dim">
        Just browsing? <Link to="/courses" className="font-semibold text-letter underline decoration-letter/30 underline-offset-4 hover:decoration-signal">Explore the courses</Link>
      </p>
    </div>
  )
}

/** Dashed swim-lane with its label inside the top-left corner, like a grouped region in a flow diagram. */
function Lane({ index, label, children }: { index: string; label: string; children: ReactNode }) {
  return (
    <div className="relative rounded-2xl border-[1.5px] border-dashed border-[oklch(45%_0.05_266)] bg-black/[0.12] px-4 pt-12 pb-5 sm:px-6 sm:pb-6">
      <span className="absolute top-4 left-4 font-mono text-[0.9rem] text-letter-dim sm:left-6">
        {index} <span className="text-letter-dim/60">/</span> <span className="text-letter/85">{label}</span>
      </span>
      {children}
    </div>
  )
}

function RouteNode({ phase: p, active, delay }: { phase: (typeof PHASES)[number]; active: boolean; delay: number }) {
  const Icon: LucideIcon = p.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      className={cn(
        'relative h-full rounded-lg border-2 px-3 pt-8 pb-3 text-center transition-shadow duration-500',
        p.border, p.fill,
        active && 'shadow-[0_2px_3px_oklch(10%_0.05_268/0.4),0_16px_32px_-14px_oklch(85%_0.165_86/0.5)]',
      )}
    >
      <Icon className={cn('absolute top-2.5 left-2.5 size-4', p.ink)} aria-hidden />
      {active && (
        <span className="absolute top-2.5 right-2.5 flex size-2" aria-label="You are here">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-go opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-go" />
        </span>
      )}
      <div className="font-mono text-[0.92rem] font-semibold text-letter">{p.label}</div>
      <div className="mt-0.5 font-mono text-[0.68rem] text-letter-dim">{p.sub}</div>
    </motion.div>
  )
}

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div role="tablist" aria-label="Log in or register" className="relative mt-6 grid h-11 grid-cols-2 rounded-lg border border-white/10 bg-black/25 p-1">
      {(['login', 'register'] as const).map((m) => {
        const active = mode === m
        return (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => setMode(m)}
            className={cn('relative rounded-md text-sm font-semibold transition-colors duration-300', active ? 'text-signal-ink' : 'text-letter-dim hover:text-letter')}
          >
            {active && (
              <motion.span
                layoutId="checkin-tab"
                className={cn('absolute inset-0 rounded-md', m === 'register' ? 'bg-go' : 'bg-signal')}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative z-10">{m === 'login' ? 'Log in' : 'Register'}</span>
          </button>
        )
      })}
    </div>
  )
}

const fieldClass =
  'h-11 border-white/15 bg-black/30 pl-10 text-letter placeholder:text-letter-dim/55 focus-visible:border-signal focus-visible:ring-signal/25'

function IconField({ icon: Icon, className, ...props }: { icon: LucideIcon } & ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-letter-dim" aria-hidden />
      <Input className={cn(fieldClass, className)} {...props} />
    </div>
  )
}

function FormError({ message }: { message: string | null }) {
  return (
    <div aria-live="assertive">
      {message && <p className="mb-4 rounded-md border border-[oklch(70%_0.17_25)]/50 bg-[oklch(35%_0.12_25)]/40 px-3 py-2 text-sm font-medium text-[oklch(85%_0.09_25)]">{message}</p>}
    </div>
  )
}

function PasswordInput({ id, autoComplete }: { id: string; autoComplete: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <IconField icon={Lock} id={id} name="password" type={show ? 'text' : 'password'} required minLength={autoComplete === 'new-password' ? 8 : undefined} autoComplete={autoComplete} className="pr-11" />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded text-letter-dim hover:bg-white/10 hover:text-letter" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

function LoginForm({ redirect }: { redirect: string }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setError(null)
    try {
      const u = await login(String(f.get('email')), String(f.get('password')))
      toast.success(`Welcome back, ${u.name.split(' ')[0]}.`)
      navigate(redirect, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormError message={error} />
      <div className="space-y-2">
        <Label className="text-letter" htmlFor="login-email">Email</Label>
        <IconField icon={Mail} id="login-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label className="text-letter" htmlFor="login-password">Password</Label>
        <PasswordInput id="login-password" autoComplete="current-password" />
      </div>
      <Button type="submit" size="lg" className="mt-2 w-full" disabled={busy}>
        {busy ? <><Loader2 className="animate-spin" /> Checking in…</> : <>Log in <ArrowRight /></>}
      </Button>
    </form>
  )
}

function RegisterForm({ redirect, initialRef }: { redirect: string; initialRef: string }) {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setError(null)
    try {
      const u = await register({
        name: String(f.get('name')),
        email: String(f.get('email')),
        password: String(f.get('password')),
        referralCode: String(f.get('referralCode') ?? ''),
      })
      toast.success(`You’re checked in, ${u.name.split(' ')[0]}.`, { description: `Your referral code is ${u.referralCode}.` })
      navigate(redirect, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><FormError message={error} /></div>
      <div className="space-y-2 sm:col-span-2">
        <Label className="text-letter" htmlFor="reg-name">Full name</Label>
        <IconField icon={UserRound} id="reg-name" name="name" required minLength={2} autoComplete="name" placeholder="As on your résumé" />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label className="text-letter" htmlFor="reg-email">Email</Label>
        <IconField icon={Mail} id="reg-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label className="text-letter" htmlFor="reg-password">Password</Label>
        <PasswordInput id="reg-password" autoComplete="new-password" />
        <p className="font-mono text-[0.68rem] text-letter-dim">min 8 characters</p>
      </div>
      <div className="space-y-2">
        <Label className="text-letter" htmlFor="reg-ref">Referral code <span className="font-normal text-letter-dim">(optional)</span></Label>
        <IconField icon={Ticket} id="reg-ref" name="referralCode" defaultValue={initialRef} placeholder="PRIY-3F9A1C" className="font-mono uppercase placeholder:normal-case" />
      </div>
      <Button type="submit" size="lg" className="mt-2 w-full sm:col-span-2" disabled={busy}>
        {busy ? <><Loader2 className="animate-spin" /> Creating account…</> : <>Create free account <ArrowRight /></>}
      </Button>
    </form>
  )
}
