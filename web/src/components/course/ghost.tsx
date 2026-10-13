import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

/** Empty and error states: a pastel icon tile, a heading and the next action. */
export function EmptyState({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-white bg-card px-6 py-12 text-center shadow-panel">
      <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-lilac text-signal shadow-[inset_0_1.5px_0_oklch(100%_0_0/0.7),inset_0_-3px_6px_oklch(35%_0.1_290/0.08)]">
        <Icon className="size-7" aria-hidden />
      </span>
      <h2 className="mt-6 text-2xl font-extrabold">{title}</h2>
      {children && <div className="mt-2 text-muted-foreground">{children}</div>}
    </div>
  )
}
