import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Popover } from 'radix-ui'
import { BookOpenCheck, ChevronRight, Gift, LogOut, Menu, UserRound, X } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { nav } from '@/config/site'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { EASE } from '@/lib/motion'

const isActive = (path: string, to: string) => (to === '/' ? path === '/' : path === to || path.startsWith(`${to}/`))

export function SiteHeader() {
  const { pathname } = useLocation()
  const { user, ready, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const signOut = async () => {
    await logout()
    toast.success('Signed out. See you soon.')
    navigate('/')
  }

  return (
    // Floating glass bar: overlays the page top (zero layout height) so the aurora band runs underneath it.
    <header className="pointer-events-none sticky top-0 z-50 -mb-[4.75rem] h-[4.75rem] px-3 pt-3 sm:px-4 2xl:px-10">
      <a href="#main" className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-signal focus:px-3 focus:py-2 focus:text-signal-ink">
        Skip to content
      </a>
      <Popover.Root open={open} onOpenChange={setOpen} modal>
        {/* Dims the page under the open menu; the bar renders after it, so it stays crisp and on top. */}
        <AnimatePresence>
          {open && (
            <motion.div
              aria-hidden
              className="pointer-events-auto fixed inset-0 bg-letter/15 backdrop-blur-[2px] xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            />
          )}
        </AnimatePresence>
        <Popover.Anchor asChild>
          <div className="on-board glass pointer-events-auto relative flex h-16 items-center justify-between gap-6 rounded-full border pr-2.5 pl-4 text-letter shadow-lift sm:pl-6 xl:pr-3">
            <Logo />

            <nav aria-label="Primary" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => {
                  const active = isActive(pathname, item.to)
                  return (
                    <li key={item.to} className="relative">
                      <NavLink
                        to={item.to}
                        className={cn(
                          'relative z-10 block rounded-full px-3 py-2 text-[0.9rem] font-semibold transition-colors duration-200',
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

              <Popover.Trigger asChild>
                <Button variant="board" size="icon-sm" className="xl:hidden" aria-label={open ? 'Close menu' : 'Open menu'}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={open ? 'close' : 'open'}
                      className="grid place-items-center"
                      initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      {open ? <X /> : <Menu />}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </Popover.Trigger>
            </div>
          </div>
        </Popover.Anchor>

        {/* Mobile menu: drops from under the bar, as wide as the bar and only as tall as its links. */}
        <Popover.Portal>
          <Popover.Content
            data-slot="menu-panel"
            side="bottom"
            align="start"
            sideOffset={8}
            className="on-board glass z-50 w-(--radix-popover-trigger-width) max-h-[calc(var(--radix-popover-content-available-height)-0.75rem)] origin-top overflow-y-auto overscroll-contain rounded-[1.75rem] border p-2 text-letter shadow-lift outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 xl:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="grid gap-0.5">
                {nav.map((item, i) => {
                  const active = isActive(pathname, item.to)
                  return (
                    <motion.li key={item.to} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.025 * i, duration: 0.3, ease: EASE }}>
                      <NavLink
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center justify-between rounded-[1.1rem] px-4 py-3 text-base font-semibold transition-[background-color,color,box-shadow]',
                          active ? 'bg-white text-signal shadow-panel' : 'text-letter hover:bg-white/70',
                        )}
                      >
                        {item.label}
                        <ChevronRight className={cn('size-4', active ? 'text-signal' : 'text-letter-dim')} aria-hidden />
                      </NavLink>
                    </motion.li>
                  )
                })}
              </ul>
              {ready && !user && (
                <Button asChild size="lg" className="mt-2 w-full" onClick={() => setOpen(false)}>
                  <Link to="/login"><UserRound /> Log in or register</Link>
                </Button>
              )}
            </nav>
            {/* The bar's ✕ is hidden from assistive tech while the menu is modal, so screen readers get a close inside it. */}
            <Popover.Close className="sr-only">Close menu</Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </header>
  )
}
