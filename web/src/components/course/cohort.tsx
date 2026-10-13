import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { CalendarDays, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Course, Status } from '@/lib/api'
import { cohortStart, shortDate, timeIST } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Cohort availability in plain words. */
export const STATUS: Record<Status, { label: string; variant: 'go' | 'call' | 'quiet' }> = {
  ENROLLING: { label: 'Enrolling now', variant: 'go' },
  FEW_SEATS: { label: 'Few seats left', variant: 'call' },
  OPEN: { label: 'Open', variant: 'quiet' },
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const s = STATUS[status]
  return <Badge variant={s.variant} className={className}>{s.label}</Badge>
}

// Decorative pastel per module, picked by catalogue position so neighbours differ. Never carries meaning.
const TINTS = ['bg-lilac', 'bg-peach', 'bg-mint', 'bg-sky', 'bg-butter'] as const
export const tintFor = (n: number) => TINTS[n % TINTS.length]

/** The module's identity: a pastel clay tile with its short code ("FICO", "BTP"). */
export function ModuleMark({ module, index, size = 'md', className }: { module: string; index: number; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const code = module.replace(/^S\/4HANA$/, 'S/4').replace('SuccessFactors', 'SF').replace('BW/4HANA', 'BW/4')
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center font-extrabold tracking-tight text-foreground/85 shadow-[inset_0_1.5px_0_oklch(100%_0_0/0.7),inset_0_-3px_6px_oklch(35%_0.1_290/0.08)]',
        tintFor(index),
        size === 'sm' && 'size-11 rounded-2xl text-[0.7rem]',
        size === 'md' && 'size-14 rounded-[1.1rem] text-sm',
        size === 'lg' && 'size-20 rounded-[1.5rem] text-lg',
        className,
      )}
    >
      {code}
    </span>
  )
}

/** India time, refreshed every 15 s. */
function useNowIST() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])
  return now.toISOString()
}

/** Hero card: the soonest cohorts, each row a link to its course. */
export function UpcomingCohorts({ courses, rows = 5, className }: { courses: Course[]; rows?: number; className?: string }) {
  const now = useNowIST()
  const soonest = [...courses].sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, rows)
  return (
    <section aria-labelledby="cohorts-h" className={cn('rounded-[2rem] border border-white/80 bg-white/65 p-3 shadow-board backdrop-blur-xl sm:p-4', className)}>
      <div className="flex items-center justify-between gap-3 px-2 pt-1 pb-3">
        <h2 id="cohorts-h" className="flex items-center gap-2.5 text-lg font-bold">
          <span className="sign-plate grid size-9 place-items-center rounded-xl"><CalendarDays className="size-4.5" aria-hidden /></span>
          Upcoming cohorts
        </h2>
        <span className="text-xs text-muted-foreground tabular">{shortDate(now)} · {timeIST(now)} IST</span>
      </div>
      <ul className="space-y-1.5">
        {courses.length === 0 && Array.from({ length: rows }, (_, i) => <li key={i} className="h-[4.25rem] animate-pulse rounded-[1.4rem] bg-white/60" />)}
        {soonest.map((c, i) => (
          <motion.li
            key={c.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={`/courses/${c.slug}`}
              className="group flex items-center gap-3 rounded-[1.4rem] bg-card/80 p-2.5 pr-3 transition-[box-shadow,transform] duration-300 hover:-translate-y-px hover:shadow-panel sm:gap-4"
            >
              <ModuleMark module={c.module} index={c.catalogOrder} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{c.role}</span>
                <span className="block truncate text-sm text-muted-foreground tabular">{cohortStart(c.startsAt)}</span>
              </span>
              <StatusBadge status={c.status} className="hidden sm:inline-flex" />
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
