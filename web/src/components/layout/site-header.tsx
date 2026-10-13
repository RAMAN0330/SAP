import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { BookOpenCheck, Gift, LogOut, Menu, UserRound } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { nav } from '@/config/site'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const isActive = (path: string, to: string) => (to === '/' ? path === '/' : path === to || path.startsWith(`${to}/`))

export function SiteHeader() {
  const { pathname } = useLocation()
  const { user, ready, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const signOut = async () => {
    await logout()
    toast.success('Signed out. See you at the next departure.')
    navigate('/')
  }

  return (
    <header className="on-board glass sticky top-0 z-50 border-b text-letter shadow-[0_8px_24px_-18px_oklch(30%_0.12_290/0.35)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-signal focus:px-3 focus:py-2 focus:text-signal-ink">
        Skip to content
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = isActive(pathname, item.to)
              return (
                <li key={item.to} className="relative">
                  <NavLink
                    to={item.to}
                    className={cn(
                      'relative z-10 block rounded-full px-3.5 py-2 text-[0.9rem] font-semibold transition-colors duration-200',
                      active ? 'text-letter' : 'text-letter-dim hover:text-letter',
                    )}
                  >
                    {item.label}
                  </NavLink>
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-white shadow-panel ring-1 ring-signal/15"
                      transition={{ type: 'spring', stiffness: 520, damping: 42 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {ready && !user && (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Log in</Link>
            </Button>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="board" size="sm" className="gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-signal text-[0.7rem] font-bold text-signal-ink">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[10ch] truncate sm:inline">{user.name.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/my-courses"><BookOpenCheck /> My courses</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/join-earn"><Gift /> Join &amp; Earn</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={signOut}><LogOut /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="board" size="icon-sm" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="on-board w-[min(88vw,22rem)] rounded-l-[2rem] border-white/70 bg-popover/80 text-letter backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle className="text-letter-dim font-mono text-xs tracking-[0.18em] uppercase">Concourse map</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="px-4">
                <ul className="divide-y divide-letter/10">
                  {nav.map((item, i) => (
                    <motion.li key={item.to} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                      <NavLink
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn('flex items-center justify-between py-3.5 text-lg font-semibold', isActive(pathname, item.to) ? 'text-signal' : 'text-letter')}
                      >
                        {item.label}
                        <span className="font-mono text-xs text-letter-dim">{`G${String(i + 1).padStart(2, '0')}`}</span>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
                {!user && (
                  <Button asChild size="lg" className="mt-6 w-full" onClick={() => setOpen(false)}>
                    <Link to="/login"><UserRound /> Log in or register</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
