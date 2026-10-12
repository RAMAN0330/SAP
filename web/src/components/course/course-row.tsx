import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Clock, FileQuestion } from 'lucide-react'
import { FlapText } from '@/components/board/split-flap'
import { statusTone } from '@/components/board/departure-board'
import { Badge } from '@/components/ui/badge'
import { DemandRamp } from './meta'
import type { Course } from '@/lib/api'
import { boardDate, boardTime, formatINR, gateCode } from '@/lib/format'

/** One departure: a board stub on the left, readable course details on the concourse side. */
export function CourseRow({ course: c, index = 0 }: { course: Course; index?: number }) {
  const delay = Math.min(index, 8) * 70
  return (
    <article className="group relative grid overflow-hidden rounded-xl border bg-card shadow-panel transition-[box-shadow,transform] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:shadow-[0_2px_2px_oklch(20%_0.05_268/0.05),0_22px_40px_-14px_oklch(20%_0.05_268/0.28)] md:grid-cols-[13.5rem_1fr_auto]">
      <div className="on-board board-surface flex flex-row items-center justify-between gap-3 p-4 md:flex-col md:items-start md:justify-between md:p-5">
        <div>
          <div className="font-mono text-[0.62rem] tracking-[0.16em] text-letter-dim uppercase">Gate</div>
          <div className="mt-1 text-[22px] md:text-[26px]"><FlapText text={gateCode(c.gate)} length={3} delay={delay} /></div>
        </div>
        <div className="text-right md:text-left">
          <div className="font-mono text-[0.62rem] tracking-[0.16em] text-letter-dim uppercase">{boardDate(c.departsAt)} ∙ {boardTime(c.departsAt)}</div>
          <div className="mt-1 text-[13px] md:text-[14px]"><FlapText text={c.status} length={10} tone={statusTone(c.status)} delay={delay + 120} /></div>
        </div>
      </div>

      <div className="min-w-0 p-5 md:px-7 md:py-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="gate">SAP {c.module}</Badge>
          <Badge variant="quiet">{c.level}</Badge>
          <Badge variant="quiet">{c.track}</Badge>
          <DemandRamp value={c.demand} className="ml-1" />
        </div>
        <h3 className="mt-3 text-xl font-bold tracking-tight">
          <Link to={`/courses/${c.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">{c.title}</Link>
        </h3>
        <p className="mt-1.5 max-w-[62ch] text-[0.95rem] leading-relaxed text-muted-foreground">{c.description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground tabular">
          <li className="flex items-center gap-1.5"><BookOpen className="size-4 text-foreground/70" aria-hidden />{c.lessonsCount} lessons</li>
          <li className="flex items-center gap-1.5"><FileQuestion className="size-4 text-foreground/70" aria-hidden />{c.questionsCount} questions</li>
          <li className="flex items-center gap-1.5"><Clock className="size-4 text-foreground/70" aria-hidden />{c.durationWeeks} weeks</li>
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4 border-t px-5 py-4 md:flex-col md:items-end md:justify-center md:border-t-0 md:border-l md:px-7">
        <div className="md:text-right">
          <div className="text-xs text-muted-foreground">Fare</div>
          <div className="text-2xl font-extrabold tracking-tight tabular">{formatINR(c.price)}</div>
        </div>
        <span className="sign-plate pointer-events-none inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-semibold">
          View course <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </article>
  )
}
