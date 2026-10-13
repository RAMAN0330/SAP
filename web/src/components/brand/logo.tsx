import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { site } from '@/config/site'

/** Mark: a grape clay flap tile split by its hinge, with a take-off arrow crossing the seam. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8', className)} aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="10" fill="var(--signal)" />
      <rect x="4" y="2.5" width="24" height="11" rx="5.5" fill="white" opacity="0.16" />
      <rect x="1" y="15.4" width="30" height="1.2" fill="var(--signal-ink)" opacity="0.28" />
      <path d="M8.5 22.5 22 9" stroke="var(--signal-ink)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M13.5 9H22v8.5" fill="none" stroke="var(--signal-ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Logo({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <Link to="/" className={cn('group inline-flex items-center gap-2.5', className)} aria-label={`${site.name} home`}>
      <LogoMark className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6" />
      <span className={cn('text-[1.15rem] leading-none tracking-tight', tone === 'light' ? 'text-letter' : 'text-foreground')}>
        <span className="font-extrabold">{site.wordmark[0]}</span>
        <span className={cn('ml-1 font-medium', tone === 'light' ? 'text-letter-dim' : 'text-muted-foreground')}>{site.wordmark[1]}</span>
      </span>
    </Link>
  )
}
