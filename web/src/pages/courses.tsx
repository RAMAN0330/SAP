import { useDeferredValue, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CloudOff, Search, SearchX, X } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { CourseRow } from '@/components/course/course-row'
import { EmptyState } from '@/components/course/ghost'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useQuery } from '@/hooks/use-query'
import { api } from '@/lib/api'
import { EASE } from '@/lib/motion'
import { levels } from '@/content/levels'

const LEVELS = ['All levels', 'Level 1', 'Level 2', 'Level 3'] as const

/* Segmented clay trays that span the full row; options share it in equal columns (2×2 on phones, one row from sm). */
const tray = 'grid w-full grid-cols-2 gap-1 sm:grid-cols-4 rounded-[1.4rem] border border-white/70 bg-board p-1.5 shadow-press'
const chip =
  'h-10 min-w-0 rounded-full px-3 text-sm font-semibold text-letter-dim transition-[background-color,color,box-shadow] duration-300 hover:bg-white/70 hover:text-letter data-[state=on]:bg-signal data-[state=on]:text-signal-ink data-[state=on]:shadow-panel'
const trayLabel = 'mb-1.5 block px-1 font-mono text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase'

export default function CoursesPage() {
  const { data: courses, error, loading, refetch } = useQuery('courses', api.courses)
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const level = params.get('level') ?? LEVELS[0]
  const levelId = (LEVELS.indexOf(level as (typeof LEVELS)[number]) || undefined) as 1 | 2 | 3 | undefined
  const levelInfo = levels.find((l) => l.id === levelId)
  const deferredQ = useDeferredValue(q)

  const set = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const needle = deferredQ.trim().toLowerCase()
    return (courses ?? []).filter((c) =>
      (!needle || `${c.module} ${c.title} ${c.role} ${c.description}`.toLowerCase().includes(needle)))
  }, [courses, deferredQ])

  const count = courses ? results.length : 0

  return (
    <>
      <PageIntro
        title="All SAP courses"
        lead="Every module in one place: configuration training, interview question banks, practical scenarios and mock rounds. Every module comes in three levels, from interview basics to advanced topics. Pick a level to see its fee, or search for the role you want."
        aside={
<div className="inline-flex flex-col gap-0.5 rounded-[1.5rem] border border-white/70 bg-white/60 px-5 py-3 shadow-panel backdrop-blur-md">
            <span className="text-xs font-semibold text-letter-dim">Showing</span>
            <span className="text-3xl font-extrabold tabular">{count} {count === 1 ? 'course' : 'courses'}</span>
          </div>
        }
      />

      <section className="container-page py-10 sm:py-14">
        <div className="glass rounded-[2rem] border p-3 shadow-panel sm:p-4">
          <div className="grid gap-3 lg:grid-cols-2 lg:gap-x-5">
            <label className="relative block w-full lg:col-span-2">
              <span className="sr-only">Search courses</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={q}
                onChange={(e) => set('q', e.target.value, '')}
                placeholder="Search a module, role or topic"
                className="h-[3.25rem] rounded-[1.4rem] bg-card pr-9 pl-9"
              />
              {q && (
                <button type="button" onClick={() => set('q', '', '')} className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Clear search">
                  <X className="size-4" />
                </button>
              )}
            </label>
            <div className="min-w-0 lg:col-span-2">
              <span className={trayLabel} aria-hidden>Level</span>
              <ToggleGroup type="single" spacing={1} value={level} onValueChange={(v) => set('level', v, LEVELS[0])} aria-label="Level" className={tray}>
                {LEVELS.map((l) => <ToggleGroupItem key={l} value={l} className={chip}>{l}</ToggleGroupItem>)}
              </ToggleGroup>
              {levelInfo && (
                <p className="mt-2 px-1 text-sm text-muted-foreground"><span className="font-semibold text-foreground">{levelInfo.tagline}.</span> {levelInfo.audience}.</p>
              )}
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">{courses ? `${count} courses shown` : ''}</p>

        {error && !courses && (
          <div className="mt-10">
            <EmptyState icon={CloudOff} title="We couldn’t load the courses">
              <p>{error.message}</p>
              <Button className="mt-5" onClick={() => refetch()}>Try again</Button>
            </EmptyState>
          </div>
        )}

        {loading && !courses && (
          <div className="mt-8 grid gap-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-44 animate-pulse rounded-xl bg-card" />)}</div>
        )}

        {courses && (
          <motion.ul layout className="mt-8 grid gap-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((c, i) => (
                <motion.li
                  key={c.slug}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.985, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 6) * 0.03 }}
                >
                  <CourseRow course={c} index={i} level={levelId} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        {courses && results.length === 0 && (
          <div className="mt-10">
            <EmptyState icon={SearchX} title="No course matches that search">
              <p>Try a module name like “FICO”, “SD” or “BTP”.</p>
              <Button variant="outline" className="mt-5" onClick={() => setParams({}, { replace: true })}>Clear all filters</Button>
            </EmptyState>
          </div>
        )}
      </section>
    </>
  )
}
