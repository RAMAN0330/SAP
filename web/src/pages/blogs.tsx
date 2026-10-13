import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Search, SearchX } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { EmptyState } from '@/components/course/ghost'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useQuery } from '@/hooks/use-query'
import { api, type BlogSummary } from '@/lib/api'
import { longDate } from '@/lib/format'
import { cn } from '@/lib/utils'

/* Same full-width segmented tray as the course filters. */
const tray = 'flex w-full flex-wrap gap-1 lg:flex-nowrap rounded-[1.4rem] border border-white/70 bg-board p-1.5 shadow-press'
const chip =
  'h-10 min-w-0 grow basis-32 rounded-full px-4 lg:basis-0 lg:px-3 text-sm font-semibold text-letter-dim transition-[background-color,color,box-shadow] duration-300 hover:bg-white/70 hover:text-letter data-[state=on]:bg-signal data-[state=on]:text-signal-ink data-[state=on]:shadow-panel'

export default function BlogsPage() {
  const { data: posts, error, refetch } = useQuery('blogs', api.blogs)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const categories = useMemo(() => ['All', ...new Set((posts ?? []).map((p) => p.category))], [posts])
  const results = (posts ?? []).filter((p) =>
    (cat === 'All' || p.category === cat) && `${p.title} ${p.excerpt}`.toLowerCase().includes(q.trim().toLowerCase()))
  const [lead, ...rest] = results

  return (
    <>
      <PageIntro title="The SAP career blog" lead="Interview questions, module choices, résumé advice and job-search tactics for SAP professionals — short, practical and written by people who hire." />
      <section className="container-page py-12 sm:py-16">
        <div className="grid gap-3">
          <label className="relative block w-full">
            <span className="sr-only">Search articles</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" className="h-[3.25rem] rounded-[1.4rem] bg-card pl-9" />
          </label>
          <ToggleGroup type="single" value={cat} onValueChange={(v) => v && setCat(v)} spacing={1} aria-label="Category" className={tray}>
            {categories.map((c) => <ToggleGroupItem key={c} value={c} className={chip}>{c}</ToggleGroupItem>)}
          </ToggleGroup>
        </div>

        {error && !posts && <p className="mt-10 text-destructive">{error.message} <button className="underline" onClick={() => refetch()}>Retry</button></p>}
        {!posts && !error && <div className="mt-10 grid gap-5 md:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-60 animate-pulse rounded-xl bg-card" />)}</div>}

        {posts && results.length === 0 && (
          <div className="mt-12">
            <EmptyState icon={SearchX} title="Nothing matches that search">
              <Button variant="outline" className="mt-5" onClick={() => { setQ(''); setCat('All') }}>Show all articles</Button>
            </EmptyState>
          </div>
        )}

        {lead && (
          <motion.ul layout className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              <PostCard key={lead.slug} post={lead} featured className={rest.length === 0 ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-2'} />
              {rest.map((p, i) => <PostCard key={p.slug} post={p} className={i === rest.length - 1 ? fillLastRow(rest.length) : undefined} />)}
            </AnimatePresence>
          </motion.ul>
        )}
      </section>
    </>
  )
}

/** The lead card takes two slots; stretch the last card so no row is left half-empty (2-col md, 3-col lg). */
function fillLastRow(restCount: number) {
  const slots = 2 + restCount
  const md = slots % 2 === 1 ? 'md:col-span-2' : ''
  const lg = slots % 3 === 1 ? 'lg:col-span-3' : slots % 3 === 2 ? 'lg:col-span-2' : 'lg:col-span-1'
  return cn(md, lg)
}

function PostCard({ post: p, featured, className }: { post: BlogSummary; featured?: boolean; className?: string }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <Link
        to={`/blogs/${p.slug}`}
        className={cn(
          'group flex h-full flex-col rounded-[1.75rem] border p-6 shadow-panel transition-[transform,border-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 sm:p-7',
          featured ? 'on-board aurora border-white/70 text-letter' : 'border-white bg-card hover:shadow-lift',
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className={cn('font-extrabold tracking-tight', featured ? 'text-3xl leading-tight sm:text-4xl' : 'text-xl leading-snug')}>{p.title}</h2>
          <ArrowUpRight className={cn('mt-1 size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5', featured ? 'text-signal' : 'text-muted-foreground')} aria-hidden />
        </div>
        <p className={cn('mt-3 leading-relaxed', featured ? 'max-w-[52ch] text-lg text-letter-dim' : 'text-muted-foreground')}>{p.excerpt}</p>
        <p className={cn('mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-6 text-sm', featured ? 'text-letter-dim' : 'text-muted-foreground')}>
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', featured ? 'bg-signal text-signal-ink' : 'bg-muted text-foreground')}>{p.category}</span>
          {p.author} ∙ {longDate(p.publishedAt)} ∙ {p.readMinutes} min read
        </p>
      </Link>
    </motion.li>
  )
}
