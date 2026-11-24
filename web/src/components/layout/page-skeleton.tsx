import { Skeleton } from '@/components/ui/skeleton'

/** Placeholder shaped like a page (aurora intro band + content cards), shown while a page's code or data loads. */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading" aria-busy="true">
      <section className="on-board aurora relative overflow-hidden">
        <div className="container-page pt-12 pb-12 sm:pt-16 sm:pb-14">
          <Skeleton className="h-5 w-28 bg-white/60" />
          <Skeleton className="mt-5 h-12 w-full max-w-xl bg-white/60" />
          <Skeleton className="mt-3 h-12 w-2/3 max-w-md bg-white/60" />
          <Skeleton className="mt-6 h-4 w-full max-w-2xl bg-white/50" />
          <Skeleton className="mt-2 h-4 w-5/6 max-w-xl bg-white/50" />
        </div>
        <div aria-hidden className="band-lip" />
      </section>
      <div className="container-page grid gap-4 py-14 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-44 rounded-xl bg-card" />)}
      </div>
    </div>
  )
}
