import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'motion/react'
import { PlaneTakeoff } from 'lucide-react'
import { FlapText, type FlapTone } from './split-flap'
import type { Course, Status } from '@/lib/api'
import { boardName, boardTime, flightCode, gateCode } from '@/lib/format'
import { cn } from '@/lib/utils'

export const statusTone = (s: Status): FlapTone => (s === 'BOARDING' ? 'go' : s === 'FINAL CALL' ? 'call' : 'dim')

function useMediaQuery(q: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setMatch(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [q])
  return match
}

function usePageVisible() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const on = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])
  return visible
}

/** IST wall clock on flaps, ticking once a minute. */
export function BoardClock({ active = true }: { active?: boolean }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [active])
  return <FlapText text={boardTime(now.toISOString())} length={5} tone="signal" stagger={40} label={`Time in India ${boardTime(now.toISOString())}`} />
}

const ROWS = 6
const CYCLE_MS = 6500

export function LiveBoard({ courses, className }: { courses: Course[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const pageVisible = usePageVisible()
  const compact = useMediaQuery('(max-width: 639px)')
  const [page, setPage] = useState(0)
  const running = inView && pageVisible && courses.length > ROWS

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setPage((p) => p + 1), CYCLE_MS)
    return () => clearInterval(id)
  }, [running])

  const rows = courses.length
    ? Array.from({ length: Math.min(ROWS, courses.length) }, (_, i) => courses[(page * ROWS + i) % courses.length])
    : []
  const destLen = compact ? 12 : 17

  return (
    <div
      ref={ref}
      className={cn('on-board board-surface relative overflow-hidden rounded-[2rem] p-3 shadow-board ring-1 ring-white/70 sm:p-5', className)}
      aria-label="Upcoming course departures"
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1 sm:mb-4">
        <div className="flex items-center gap-2.5">
          <span className="sign-plate grid size-8 place-items-center rounded-xl">
            <PlaneTakeoff className="size-4" strokeWidth={2.25} aria-hidden />
          </span>
          <span className="text-[0.95rem] font-bold tracking-tight text-letter sm:text-lg">Departures</span>
          <span className="hidden text-sm text-letter-dim sm:inline">next cohorts</span>
        </div>
        <div className="text-[13px] sm:text-[15px]"><BoardClock active={inView && pageVisible} /></div>
      </div>

      <div
        className="grid items-center gap-x-3 border-b border-letter/10 px-1 pb-2 font-mono text-[0.62rem] tracking-[0.14em] text-letter-dim uppercase sm:gap-x-4 sm:text-[0.68rem]"
        style={{ gridTemplateColumns: compact ? 'auto 1fr auto' : 'auto auto 1fr auto auto' }}
        aria-hidden
      >
        <span className="w-[4.1em]">Time</span>
        {!compact && <span className="w-[6.4em]">Flight</span>}
        <span>Destination</span>
        {!compact && <span>Gate</span>}
        <span className={compact ? 'w-[6.3em] text-right' : 'w-[8.3em]'}>Status</span>
      </div>

      <ul className="mt-1.5 space-y-[0.32rem] text-[12.5px] sm:text-[15px] lg:text-[16px]">
        {rows.map((c, i) => (
          <li key={i}>
            <Link
              to={`/courses/${c.slug}`}
              aria-label={`${c.title}: departs ${boardTime(c.departsAt)} from gate ${gateCode(c.gate)}, ${c.status.toLowerCase()}`}
              className="group grid items-center gap-x-3 rounded-xl px-1 py-1 transition-colors duration-300 hover:bg-white/60 sm:gap-x-4"
              style={{ gridTemplateColumns: compact ? 'auto 1fr auto' : 'auto auto 1fr auto auto' }}
            >
              <FlapText text={boardTime(c.departsAt)} length={5} delay={i * 110} label={boardTime(c.departsAt)} />
              {!compact && <FlapText text={flightCode(c.gate)} length={6} delay={i * 110 + 60} label={flightCode(c.gate)} />}
              <FlapText text={boardName(c.destination, destLen)} length={destLen} delay={i * 110 + 120} className="min-w-0 overflow-hidden" label={c.destination} />
              {!compact && <FlapText text={gateCode(c.gate)} length={3} delay={i * 110 + 260} />}
              <FlapText
                text={compact && c.status === 'FINAL CALL' ? 'FINAL' : c.status}
                length={compact ? 8 : 10}
                tone={statusTone(c.status)}
                delay={i * 110 + 300}
                align={compact ? 'right' : 'left'}
                label={c.status}
              />
            </Link>
          </li>
        ))}
        {!rows.length && Array.from({ length: ROWS }, (_, i) => (
          <li key={i} className="px-1 py-1"><FlapText text="" length={compact ? 26 : 44} label="Loading" /></li>
        ))}
      </ul>
    </div>
  )
}
