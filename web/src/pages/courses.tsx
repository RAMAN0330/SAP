import { useDeferredValue, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Search, X } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { FlapText } from '@/components/board/split-flap'
import { CourseRow } from '@/components/course/course-row'
import { GhostBoard } from '@/components/course/ghost'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useQuery } from '@/hooks/use-query'
import { api } from '@/lib/api'

const LEVELS = ['All levels', 'Beginner', 'Intermediate', 'Advanced'] as const
const TRACKS = ['All tracks', 'Functional', 'Technical', 'Cloud'] as const

const chip =
  'h-9 rounded-md border border-foreground/15 bg-card px-3.5 text-sm font-semibold data-[state=on]:border-board data-[state=on]:bg-board data-[state=on]:text-letter'

export default function CoursesPage() {
  const { data: courses, error, loading, refetch } = useQuery('courses', api.courses)
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const level = params.get('level') ?? LEVELS[0]
  const track = params.get('track') ?? TRACKS[0]
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
      (level === LEVELS[0] || c.level === level) &&
      (track === TRACKS[0] || c.track === track) &&
      (!needle || `${c.module} ${c.title} ${c.destination} ${c.description}`.toLowerCase().includes(needle)))
  }, [courses, deferredQ, level, track])

  const count = courses ? results.length : 0

  return (
    <>
      <PageIntro
        title="All SAP courses"
        lead="Every module on one board: configuration training, interview question banks, practical scenarios and mock rounds. Filter by level or track, or search for the role you want. Departure times, fares and demand ratings are sample data."
        aside={
          <div className="board-surface inline-flex flex-col gap-1 rounded-lg p-3 ring-1 ring-white/10">
            <span className="font-mono text-[0.62rem] tracking-[0.16em] text-letter-dim uppercase">Showing</span>
            <span className="text-[20px]">
              <FlapText text={`${String(count).padStart(2, '0')} GATES`} length={8} tone="signal" label={`${count} courses`} />
            </span>
          </div>
        }
      />

      <section className="container-page py-10 sm:py-14">
        <div className="sticky top-16 z-30 -mx-4 border-b bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search courses</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={q}
                onChange={(e) => set('q', e.target.value, '')}
                placeholder="Search a module, role or topic"
                className="h-10 bg-card pr-9 pl-9"
              />
              {q && (
                <button type="button" onClick={() => set('q', '', '')} className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Clear search">
                  <X className="size-4" />
                </button>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              <ToggleGroup type="single" value={level} onValueChange={(v) => set('level', v, LEVELS[0])} aria-label="Level" className="flex flex-wrap gap-1.5">
                {LEVELS.map((l) => <ToggleGroupItem key={l} value={l} className={chip}>{l}</ToggleGroupItem>)}
              </ToggleGroup>
              <span className="mx-1 hidden w-px self-stretch bg-border sm:block" aria-hidden />
              <ToggleGroup type="single" value={track} onValueChange={(v) => set('track', v, TRACKS[0])} aria-label="Track" className="flex flex-wrap gap-1.5">
                {TRACKS.map((t) => <ToggleGroupItem key={t} value={t} className={chip}>{t}</ToggleGroupItem>)}
              </ToggleGroup>
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">{courses ? `${count} courses shown` : ''}</p>

        {error && !courses && (
          <div className="mt-10">
            <GhostBoard readout="DELAYED" title="We couldn’t load the board">
              <p>{error.message}</p>
              <Button className="mt-5" onClick={() => refetch()}>Try again</Button>
            </GhostBoard>
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
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 6) * 0.03 }}
                >
                  <CourseRow course={c} index={i} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        {courses && results.length === 0 && (
          <div className="mt-10">
            <GhostBoard readout="NO DEPARTURES" title="No course matches those filters">
              <p>Try a broader level or track, or search for a module name like “FICO” or “BTP”.</p>
              <Button variant="outline" className="mt-5" onClick={() => setParams({}, { replace: true })}>Clear all filters</Button>
            </GhostBoard>
          </div>
        )}
      </section>
    </>
  )
}
