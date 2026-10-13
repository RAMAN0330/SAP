import { useState, type ComponentProps, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import {
  ArrowRight, BookOpenCheck, Eye, EyeOff, Gift, KeyRound, Loader2, Lock, Mail, MessagesSquare, Ticket, UserPlus, UserRound,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const safeRedirect = (r: string | null) => (r && r.startsWith('/') && !r.startsWith('//') ? r : '/my-courses')

type Mode = 'login' | 'register'

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
    <section className="aurora relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16 lg:py-20">
        <Intro mode={mode} />
        <AuthCard mode={mode} setMode={setMode} redirect={redirect} initialRef={params.get('ref') ?? ''} />
      </div>
    </section>
  )
}

const perks = [
  { icon: BookOpenCheck, title: 'Track every lesson', text: 'Enrol in any module and see exactly what is done and what is left.', tint: 'bg-lilac' },
  { icon: MessagesSquare, title: 'Practise real questions', text: 'The full question bank with model answers, organised the way panels ask.', tint: 'bg-mint' },
  { icon: Gift, title: 'Earn with referrals', text: 'Get a personal referral code the moment you register.', tint: 'bg-peach' },
] as const

function Intro({ mode }: { mode: Mode }) {
  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.h1
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.4, ease: EASE }}
          className="max-w-md text-4xl leading-[1.04] font-extrabold sm:text-5xl"
        >
          {mode === 'register' ? <>Start preparing <span className="text-signal">today.</span></> : <>Welcome <span className="text-signal">back.</span></>}
        </motion.h1>
      </AnimatePresence>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-letter-dim">
        One account for your courses, progress and referral rewards. Log in, or create a free account to enrol.
      </p>
      <ul className="mt-8 grid max-w-md gap-3">
        {perks.map((p, i) => (
          <motion.li
            key={p.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: EASE }}
            className="flex items-start gap-4 rounded-[1.5rem] border border-white/70 bg-white/55 p-4 shadow-panel backdrop-blur-md"
          >
            <span className={cn('grid size-11 shrink-0 place-items-center rounded-2xl text-foreground/80 shadow-[inset_0_1.5px_0_oklch(100%_0_0/0.7)]', p.tint)}>
              <p.icon className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-bold">{p.title}</span>
              <span className="mt-0.5 block text-sm text-letter-dim">{p.text}</span>
            </span>
          </motion.li>
        ))}
      </ul>
      <p className="mt-6 max-w-md text-xs text-letter-dim">Passwords are hashed with scrypt and sessions are held server-side, expiring after 7 days.</p>
    </div>
  )
}

function AuthCard({ mode, setMode, redirect, initialRef }: { mode: Mode; setMode: (m: Mode) => void; redirect: string; initialRef: string }) {
  return (
    <div>
      <motion.div
        layout
        transition={{ duration: 0.4, ease: EASE }}
        className="relative mx-auto w-full max-w-[34rem] rounded-[2rem] border border-white bg-white/80 p-5 shadow-board backdrop-blur-xl sm:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="sign-plate grid size-11 place-items-center rounded-2xl">
            {mode === 'register' ? <UserPlus className="size-5" aria-hidden /> : <KeyRound className="size-5" aria-hidden />}
          </span>
          <div>
            <h2 className="text-xl font-extrabold">{mode === 'register' ? 'Create your free account' : 'Log in to your account'}</h2>
            <p className="text-sm text-muted-foreground">{mode === 'register' ? 'Takes less than a minute.' : 'Use the email you registered with.'}</p>
          </div>
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
      <p className="mt-6 text-center text-sm text-letter-dim">
        Just browsing? <Link to="/courses" className="font-semibold text-letter underline decoration-letter/30 underline-offset-4 hover:decoration-signal">Explore the courses</Link>
      </p>
    </div>
  )
}

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div role="tablist" aria-label="Log in or register" className="relative mt-6 grid h-11 grid-cols-2 rounded-full border border-white/70 bg-board p-1 shadow-press">
      {(['login', 'register'] as const).map((m) => {
        const active = mode === m
        return (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => setMode(m)}
            className={cn('relative rounded-full text-sm font-semibold transition-colors duration-300', active ? 'text-signal-ink' : 'text-muted-foreground hover:text-foreground')}
          >
            {active && (
              <motion.span
                layoutId="checkin-tab"
                className="absolute inset-0 rounded-full bg-signal shadow-panel"
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
  'h-11 rounded-xl border-letter/15 bg-white/80 pl-10 text-letter placeholder:text-letter-dim/55 focus-visible:border-signal focus-visible:ring-signal/25'

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
      {message && <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{message}</p>}
    </div>
  )
}

function PasswordInput({ id, autoComplete }: { id: string; autoComplete: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <IconField icon={Lock} id={id} name="password" type={show ? 'text' : 'password'} required minLength={autoComplete === 'new-password' ? 8 : undefined} autoComplete={autoComplete} className="pr-11" />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded text-letter-dim hover:bg-board hover:text-letter" aria-label={show ? 'Hide password' : 'Show password'}>
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
        {busy ? <><Loader2 className="animate-spin" /> Logging in…</> : <>Log in <ArrowRight /></>}
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
      toast.success(`Your account is ready, ${u.name.split(' ')[0]}.`, { description: `Your referral code is ${u.referralCode}.` })
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
        <p className="text-xs text-letter-dim">At least 8 characters</p>
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
