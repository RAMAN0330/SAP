import { cn } from '@/lib/utils'

const RAMP = ['Steady', 'Strong', 'Hot'] as const

/** One fixed three-step ramp used everywhere for hiring demand. */
export function DemandRamp({ value, className }: { value: 1 | 2 | 3; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-xs text-muted-foreground', className)}>
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span key={n} className={cn('w-[5px] rounded-[1px]', n <= value ? 'bg-foreground' : 'bg-foreground/15')} style={{ height: 4 + n * 4 }} />
        ))}
      </span>
      <span><span className="sr-only">Hiring demand: </span>{RAMP[value - 1]} demand</span>
    </span>
  )
}

export const PHASES = ['Check-in', 'Boarding', 'In flight', 'Landed'] as const
export function phaseFor(done: number, total: number) {
  if (total === 0 || done === 0) return 0
  if (done >= total) return 3
  return done / total < 0.34 ? 1 : 2
}

/** Named phases — words and pattern, never colour alone. */
export function PhaseTrack({ done, total, className }: { done: number; total: number; className?: string }) {
  const current = phaseFor(done, total)
  return (
    <ol className={cn('grid grid-cols-4 gap-1.5', className)} aria-label={`Progress: ${PHASES[current]}, ${done} of ${total} stops done`}>
      {PHASES.map((p, i) => (
        <li key={p} className="min-w-0">
          <div
            className={cn(
              'h-1.5 rounded-full transition-colors duration-500',
              i < current ? 'bg-foreground' : i === current ? 'bg-[repeating-linear-gradient(135deg,var(--foreground)_0_4px,transparent_4px_7px)]' : 'bg-foreground/12',
            )}
          />
          <div className={cn('mt-1.5 truncate text-[0.7rem] font-semibold', i === current ? 'text-foreground' : 'text-muted-foreground')}>{p}</div>
        </li>
      ))}
    </ol>
  )
}
