import { memo, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

// Physical drum order, like a real Solari module: the flap can only advance forward.
const DRUM = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:./-&→·'
const MAX_STEPS = 9 // cap travel so long jumps still resolve quickly
const STEP_MS = 62

export type FlapTone = 'letter' | 'signal' | 'go' | 'call' | 'dim'

const norm = (ch: string) => {
  const up = ch.toUpperCase()
  return DRUM.includes(up) ? up : ' '
}

interface CellProps {
  char: string
  delay?: number
  tone?: FlapTone
  /** start every mount from a blank flap so boards "arrive" */
  fromBlank?: boolean
  active?: boolean
}

export const FlapCell = memo(function FlapCell({ char, delay = 0, tone = 'letter', fromBlank = true, active = true }: CellProps) {
  const reduce = useReducedMotion()
  const target = norm(char)
  const [shown, setShown] = useState(() => (fromBlank && !reduce ? ' ' : target))
  const [fold, setFold] = useState<{ from: string; to: string; n: number } | null>(null)
  const shownRef = useRef(shown)
  shownRef.current = shown

  useEffect(() => {
    if (!active) return
    if (reduce) {
      setShown(target)
      setFold(null)
      return
    }
    if (shownRef.current === target) return

    const from = DRUM.indexOf(shownRef.current)
    const to = DRUM.indexOf(target)
    let distance = (to - from + DRUM.length) % DRUM.length
    let start = from
    if (distance > MAX_STEPS) {
      start = (to - MAX_STEPS + DRUM.length) % DRUM.length
      distance = MAX_STEPS
    }

    const timers: number[] = []
    let prev = shownRef.current
    for (let i = 1; i <= distance; i++) {
      const next = DRUM[(start + i) % DRUM.length]
      const before = prev
      timers.push(window.setTimeout(() => {
        setFold({ from: before, to: next, n: i })
        setShown(next)
      }, delay + (i - 1) * STEP_MS))
      prev = next
    }
    timers.push(window.setTimeout(() => setFold(null), delay + distance * STEP_MS + STEP_MS))
    return () => timers.forEach(clearTimeout)
  }, [target, delay, reduce, active])

  return (
    <span className="flap" data-tone={tone} data-blank={shown === ' ' && !fold} style={{ ['--flap-step' as string]: `${STEP_MS / 2}ms` }}>
      {/* settled faces */}
      <span className="flap__half flap__half--top"><span>{shown}</span></span>
      <span className="flap__half flap__half--bottom"><span>{fold ? fold.from : shown}</span></span>
      {fold && (
        <>
          <span key={`t${fold.n}`} className="flap__half flap__half--top flap__fold-top" aria-hidden><span>{fold.from}</span></span>
          <span key={`b${fold.n}`} className="flap__half flap__half--bottom flap__fold-bottom" aria-hidden><span>{fold.to}</span></span>
        </>
      )}
    </span>
  )
})

interface TextProps {
  text: string
  length: number
  tone?: FlapTone
  delay?: number
  /** ms between neighbouring cells starting — gives the ripple across a row */
  stagger?: number
  align?: 'left' | 'right'
  className?: string
  active?: boolean
  label?: string
}

/** A run of flap cells. Screen readers get the plain text once, not 20 letters. */
export function FlapText({ text, length, tone = 'letter', delay = 0, stagger = 22, align = 'left', className, active = true, label }: TextProps) {
  const clean = text.toUpperCase().slice(0, length)
  const padded = align === 'right' ? clean.padStart(length, ' ') : clean.padEnd(length, ' ')
  return (
    <span className={cn('inline-flex gap-[0.08em]', className)} role="text" aria-label={label ?? text}>
      {Array.from(padded).map((ch, i) => (
        <FlapCell key={i} char={ch} tone={tone} delay={delay + i * stagger} active={active} />
      ))}
    </span>
  )
}
