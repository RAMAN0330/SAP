import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/** Dark sign band that continues from the header; the h1 is the sign, `aside` carries a page-specific readout. */
export function PageIntro({ title, lead, aside, children, className }: { title: ReactNode; lead?: ReactNode; aside?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section className={cn('on-board board-surface relative overflow-hidden text-letter', className)}>
      <div className="container-page grid gap-8 pt-12 pb-14 sm:pt-16 sm:pb-16 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-[3.5rem]"
          >
            {title}
          </motion.h1>
          {lead && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-4 max-w-[60ch] text-[1.05rem] leading-relaxed text-letter-dim"
            >
              {lead}
            </motion.p>
          )}
          {children}
        </div>
        {aside && <div className="lg:pb-1">{aside}</div>}
      </div>
      <div aria-hidden className="h-1.5 bg-[repeating-linear-gradient(90deg,var(--signal)_0_28px,var(--board)_28px_56px)] opacity-90" />
    </section>
  )
}
