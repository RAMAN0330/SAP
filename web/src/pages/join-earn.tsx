import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { Check, Copy, Gift, Link2, Share2, Wallet } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { FlapText } from '@/components/board/split-flap'
import { GhostBoard } from '@/components/course/ghost'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@/hooks/use-query'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { formatINR, longDate } from '@/lib/format'

const steps = [
  { icon: Share2, title: 'Share your code', text: 'Every member gets a personal code the moment they register.' },
  { icon: Gift, title: 'A friend enrols', text: 'They register with your code and enrol in any SAP course.' },
  { icon: Wallet, title: 'You earn', text: 'A reward is credited for every friend who enrols — tracked below.' },
]

export default function JoinEarnPage() {
  const { user, ready } = useAuth()
  return (
    <>
      <PageIntro
        title="Join & Earn"
        lead="Bring a friend onto the same flight. Help another SAP aspirant get interview-ready, and earn a reward for every friend who enrols with your code."
      />
      <section className="container-page py-14 sm:py-20">
        <ol className="relative grid gap-8 md:grid-cols-3 md:gap-10" aria-label="How referrals work">
          <span aria-hidden className="absolute top-5 right-[16%] left-[5%] hidden h-[3px] rounded-full bg-[repeating-linear-gradient(90deg,var(--foreground)_0_10px,transparent_10px_18px)] opacity-20 md:block" />
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <span className="sign-plate relative z-10 grid size-11 place-items-center rounded-md"><s.icon className="size-5" strokeWidth={2.2} aria-hidden /></span>
              <h2 className="mt-4 text-xl font-bold">{s.title}</h2>
              <p className="mt-1.5 max-w-xs text-muted-foreground">{s.text}</p>
            </motion.li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted-foreground">Reward amount and payout terms are placeholders — set your real programme rules before launch.</p>

        <div className="mt-14">{!ready ? <div className="h-64 animate-pulse rounded-xl bg-card" /> : user ? <Dashboard /> : <Guest />}</div>
      </section>
    </>
  )
}

function Guest() {
  return (
    <GhostBoard readout="CODE PENDING" title="Create a free account to start earning">
      <p>Your referral code is generated the moment you register.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild><Link to="/login?mode=register&redirect=/join-earn">Register free</Link></Button>
        <Button asChild variant="outline"><Link to="/login?redirect=/join-earn">I have an account</Link></Button>
      </div>
    </GhostBoard>
  )
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success(`${label} copied`)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.error('Couldn’t copy automatically — select the text and copy it instead.')
    }
  }
  return (
    <Button variant="outline" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`} className="min-w-28">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'y' : 'n'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center gap-2"
        >
          {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const { data, error, refetch } = useQuery(`me:referrals:${user!.id}`, api.referrals)
  if (error) return <p className="text-destructive">{error.message} <button className="underline" onClick={() => refetch()}>Retry</button></p>
  if (!data) return <div className="h-64 animate-pulse rounded-xl bg-card" />

  const link = `${window.location.origin}/login?mode=register&ref=${data.code}`
  const enrolled = data.friends.filter((f) => f.enrolled).length

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <div className="on-board board-surface rounded-2xl p-6 text-letter shadow-board sm:p-8">
        <h2 className="font-mono text-[0.68rem] tracking-[0.16em] text-letter-dim uppercase">Your referral code</h2>
        <div className="mt-4 text-[24px] sm:text-[34px]">
          <FlapText text={data.code} length={data.code.length} tone="signal" stagger={55} label={data.code} />
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-letter/10 pt-6">
          {[
            ['Friends joined', String(data.friends.length)],
            ['Enrolled', String(enrolled)],
            ['Earned', formatINR(data.earned)],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="font-mono text-[0.6rem] tracking-[0.14em] text-letter-dim uppercase">{k}</div>
              <div className="mt-1 text-xl font-extrabold tabular sm:text-2xl">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border bg-card p-5 shadow-panel">
          <h3 className="font-bold">Share it</h3>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex h-10 min-w-0 flex-1 items-center rounded-md border bg-muted px-3 font-mono text-sm">{data.code}</code>
            <CopyButton value={data.code} label="Code" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border bg-muted px-3 text-sm text-muted-foreground">
              <Link2 className="size-4 shrink-0" aria-hidden /><span className="truncate">{link}</span>
            </span>
            <CopyButton value={link} label="Invite link" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Friends who open the link land on registration with your code filled in. You earn {formatINR(data.rewardPerEnrolment)} per enrolment.</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-panel">
          <h3 className="font-bold">Friends</h3>
          {data.friends.length === 0 ? (
            <div className="mt-3">
              <div className="on-board board-surface inline-flex rounded-md p-2 text-[13px]"><FlapText text="NO FRIENDS YET" length={14} tone="dim" stagger={30} /></div>
              <p className="mt-2 text-sm text-muted-foreground">No one has used your code yet. Share it with a colleague preparing for SAP interviews.</p>
            </div>
          ) : (
            <ul className="mt-3 divide-y">
              {data.friends.map((f, i) => (
                <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                  <span><span className="font-semibold">{f.name}</span> <span className="text-muted-foreground">· joined {longDate(f.joinedAt)}</span></span>
                  <Badge variant={f.enrolled ? 'go' : 'quiet'}>{f.enrolled ? 'Enrolled' : 'Registered'}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
