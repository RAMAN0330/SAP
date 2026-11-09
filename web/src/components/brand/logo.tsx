import { useId } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { site } from '@/config/site'

// "C2C" monogram on a 64-unit grid. Same geometry as public/favicon.svg.
const C1 = 'M19.05 26.91A7.6 7.6 0 1 0 19.05 37.09'
const C2 = 'M56.25 26.91A7.6 7.6 0 1 0 56.25 37.09'
const TEETH =
  'M15.52 22.43L15.55 19.18L11.25 19.18L11.28 22.43ZM8.13 23.73L5.85 21.42L2.82 24.45L5.13 26.73ZM3.83 29.88L0.58 29.85L0.58 34.15L3.83 34.12Z' +
  'M5.13 37.27L2.82 39.55L5.85 42.58L8.13 40.27ZM11.28 41.57L11.25 44.82L15.55 44.82L15.52 41.57Z'
const TAIL = 'M45.62 39.97L44.4 47L51.91 41.31Z'
const TWO = 'M27.8 27.8A4.2 4.2 0 0 1 36.2 27.8C36.2 31.83 31.58 36.2 27.8 40.4L36.2 40.4'

/** Mark: a "C2C" monogram on an ocean clay tile. The first C has gear teeth (config), the second a speech tail (consult); the gold 2 reads "to". */
export function LogoMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 64 64" className={cn('size-8', className)} aria-hidden>
      <defs>
        <linearGradient id={`${id}-tile`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0" stopColor="oklch(66% 0.13 225)" />
          <stop offset="1" stopColor="oklch(50% 0.16 250)" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.22" cy="0.08" r="0.75">
          <stop offset="0" stopColor="white" stopOpacity="0.28" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${id}-tile)`} />
      <rect width="64" height="64" rx="18" fill={`url(#${id}-glow)`} />
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="17.25" fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" />
      <g transform="translate(32 32) scale(0.84) translate(-29.9 -33.2)">
        <g fill="none" stroke="var(--signal-ink)" strokeWidth="5.6" strokeLinecap="round">
          <path d={C1} />
          <path d={C2} />
        </g>
        <path d={TEETH} fill="var(--signal-ink)" />
        <path d={TAIL} fill="var(--signal-ink)" stroke="var(--signal-ink)" strokeWidth="1.2" strokeLinejoin="round" />
        <path d={TWO} fill="none" stroke="oklch(89% 0.13 88)" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

export function Logo({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  const [config, two, consult] = site.wordmark
  return (
    <Link to="/" className={cn('group inline-flex items-center gap-2.5', className)} aria-label={`${site.name} home`}>
      <LogoMark className="transition-transform duration-500 ease-[var(--ease-smooth)] group-hover:-rotate-6" />
      <span className={cn('text-[1.15rem] leading-none font-extrabold tracking-tight', tone === 'light' ? 'text-letter' : 'text-foreground')}>
        {config}
        <span className="mx-px text-signal">{two}</span>
        <span className={cn('font-semibold', tone === 'light' ? 'text-letter-dim' : 'text-muted-foreground')}>{consult}</span>
      </span>
    </Link>
  )
}
