import type { ReactNode } from 'react'
import { FlapText } from '@/components/board/split-flap'

/** Empty states drawn as a blank board strip — designed, not missing. */
export function GhostBoard({ readout, title, children }: { readout: string; title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-dashed border-foreground/20 bg-card px-6 py-10 text-center shadow-panel">
      <div className="on-board board-surface mx-auto inline-flex rounded-lg p-2.5 text-[15px]">
        <FlapText text={readout} length={Math.max(readout.length, 12)} tone="dim" stagger={30} />
      </div>
      <h2 className="mt-6 text-2xl font-extrabold">{title}</h2>
      {children && <div className="mt-2 text-muted-foreground">{children}</div>}
    </div>
  )
}
