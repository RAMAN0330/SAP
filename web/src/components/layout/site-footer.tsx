import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { site } from '@/config/site'

const cols = [
  { title: 'Platform', links: [['All courses', '/courses'], ['My courses', '/my-courses'], ['Join & Earn', '/join-earn'], ['Blog', '/blogs']] },
  { title: 'Company', links: [['About us', '/about'], ['Contact us', '/contact'], ['Log in / Register', '/login']] },
] as const

export function SiteFooter() {
  return (
    <footer className="on-board board-surface mt-auto rounded-t-[2.5rem] text-letter shadow-[inset_0_2px_0_oklch(100%_0_0/0.6),0_-12px_30px_-18px_oklch(30%_0.12_290/0.3)]">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-letter-dim">{site.blurb}</p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h2 className="font-mono text-[0.7rem] font-semibold tracking-[0.16em] text-signal uppercase">{col.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map(([label, to]) => (
                <li key={to}><Link to={to} className="text-letter-dim transition-colors hover:text-letter">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="font-mono text-[0.7rem] font-semibold tracking-[0.16em] text-signal uppercase">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-letter-dim">
            <li className="flex gap-2.5"><Mail className="mt-0.5 size-4 shrink-0 text-letter" aria-hidden /><a href={`mailto:${site.contact.email}`} className="hover:text-letter">{site.contact.email}</a></li>
            <li className="flex gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-letter" aria-hidden />{site.contact.phone}</li>
            <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-letter" aria-hidden />{site.contact.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-letter/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-letter-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. SAP and SAP module names are trademarks of SAP SE; this academy is independent.</p>
          <p>Contact details, prices and instructor names are placeholders.</p>
        </div>
      </div>
    </footer>
  )
}
