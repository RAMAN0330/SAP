import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronRight, Flame } from 'lucide-react'
import { tintFor } from '@/components/course/cohort'
import { Badge } from '@/components/ui/badge'
import type { BlogSummary } from '@/lib/api'
import { cn } from '@/lib/utils'

const NEW_DAYS = 14
// Below this many rows the list doesn't fill the frame, so it stays still instead of looping.
const LOOP_MIN = 5

/** Hero card: up to ten articles scrolling upward in an endless loop. Pauses on hover or keyboard focus. */
export function TopBlogs({ posts, max = 10, className }: { posts?: BlogSummary[]; max?: number; className?: string }) {
  const top = (posts ?? []).slice(0, max)
  const loops = top.length >= LOOP_MIN
  return (
    <section aria-labelledby="top-blogs-h" className={cn('rounded-[2rem] border border-white/80 bg-white/65 p-3 shadow-board backdrop-blur-xl sm:p-4', className)}>
      <div className="flex items-center justify-between gap-3 px-2 pt-1 pb-3">
        <h2 id="top-blogs-h" className="flex items-center gap-2.5 text-lg font-bold">
          <span className="sign-plate grid size-9 place-items-center rounded-xl"><Flame className="size-4.5" aria-hidden /></span>
          {top.length ? `Top ${top.length} blogs` : 'Top blogs'}
        </h2>
        <Link to="/blogs" className="inline-flex items-center gap-1 text-sm font-semibold text-letter-dim hover:text-signal">
          View all <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="ticker-frame relative h-[22.5rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]">
        {!posts && (
          <ul className="space-y-1.5 py-2">
            {Array.from({ length: 5 }, (_, i) => <li key={i} className="h-[4.25rem] animate-pulse rounded-[1.4rem] bg-white/60" />)}
          </ul>
        )}
        {posts && (
          <div className="animate-in duration-500 fade-in-0">
            <div className={cn(loops && 'ticker')} style={{ '--ticker-duration': `${top.length * 5}s` } as CSSProperties}>
              <BlogList posts={top} />
              {loops && <BlogList posts={top} copy />}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/** One pass of the list. The copy exists only to make the loop seamless, so it is hidden from assistive tech and tab order. */
function BlogList({ posts, copy }: { posts: BlogSummary[]; copy?: boolean }) {
  const fresh = Date.now() - NEW_DAYS * 86_400_000
  return (
    <ul className="space-y-1.5 pt-2 pb-0" aria-hidden={copy || undefined} data-ticker-copy={copy || undefined}>
      {posts.map((p, i) => (
        <li key={p.slug}>
          <Link
            to={`/blogs/${p.slug}`}
            tabIndex={copy ? -1 : undefined}
            className="group flex items-center gap-3 rounded-[1.4rem] bg-card/80 p-2.5 pr-3 transition-[box-shadow,background-color] duration-300 hover:bg-card hover:shadow-panel sm:gap-4"
          >
            <span
              aria-hidden
              className={cn(
                'grid size-11 shrink-0 place-items-center rounded-2xl text-sm font-extrabold tabular text-foreground/85 shadow-[inset_0_1.5px_0_oklch(100%_0_0/0.7),inset_0_-3px_6px_oklch(35%_0.1_250/0.08)]',
                tintFor(i),
              )}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold group-hover:text-signal">{p.title}</span>
              <span className="block truncate text-sm text-muted-foreground">{p.category} · {p.readMinutes} min read</span>
            </span>
            {Date.parse(p.publishedAt) > fresh && <Badge variant="go" className="hidden sm:inline-flex">New</Badge>}
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  )
}
