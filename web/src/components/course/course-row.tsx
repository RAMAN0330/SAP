import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, CalendarDays, Clock, FileQuestion } from 'lucide-react'
import { ModuleMark, StatusBadge, tintFor } from './cohort'
import { Badge } from '@/components/ui/badge'
import { DemandRamp } from './meta'
import type { Course } from '@/lib/api'
import { cohortStart, formatINR } from '@/lib/format'
import { cn } from '@/lib/utils'

/** One course listing: a pastel module panel, readable details, then fee and action. The whole row is one link. */
export function CourseRow({ course: c }: { course: Course; index?: number }) {
  return (
    <article className="group relative grid overflow-hidden rounded-[1.75rem] border border-white bg-card shadow-panel transition-[box-shadow,transform] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift md:grid-cols-[13.5rem_1fr_auto]">
      <div className={cn('m-2 flex flex-row items-center gap-4 rounded-[1.35rem] p-4 shadow-press md:mr-0 md:flex-col md:items-start md:justify-between md:p-5', tintFor(c.catalogOrder), '[background-image:linear-gradient(180deg,oklch(100%_0_0/0.5),transparent_70%)]')}>
        <ModuleMark module={c.module} index={c.catalogOrder} className="bg-card/80" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70"><CalendarDays className="size-3.5" aria-hidden /> Next cohort</div>
          <div className="mt-0.5 text-sm font-bold tabular">{cohortStart(c.startsAt)}</div>
          <StatusBadge status={c.status} className="mt-2 bg-card/85" />
        </div>
      </div>

      <div className="min-w-0 p-5 md:px-7 md:py-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="module">SAP {c.module}</Badge>
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
          <div className="text-xs text-muted-foreground">Course fee</div>
          <div className="text-2xl font-extrabold tracking-tight tabular">{formatINR(c.price)}</div>
        </div>
        <span className="sign-plate pointer-events-none inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold">
          View course <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </article>
  )
}
