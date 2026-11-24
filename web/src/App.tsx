import { lazy, Suspense, type ComponentType } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig, type Variants } from 'motion/react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { PageSkeleton } from '@/components/layout/page-skeleton'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import HomePage from '@/pages/home'
import { EASE } from '@/lib/motion'

// Pages slide in from the right on forward navigation and from the left on Back.
const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: 48 * dir }),
  center: { opacity: 1, x: 0, transition: { duration: 0.32, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: -48 * dir, transition: { duration: 0.16, ease: 'easeIn' } }),
}

// A code-split page. Once its code is preloaded it renders synchronously, so a page switch never flashes a loader.
// After a deploy, an open tab may ask for chunks that no longer exist: reload once to pick up the new build.
function page(load: () => Promise<{ default: ComponentType }>) {
  let Loaded: ComponentType | undefined
  const preload = () =>
    load().then((m) => (Loaded = m.default, m), (err) => {
      if (sessionStorage.getItem('chunk-reload')) throw err
      sessionStorage.setItem('chunk-reload', '1')
      window.location.reload()
      return new Promise<never>(() => {})
    })
  const Lazy = lazy(preload)
  const Page = () => (Loaded ? <Loaded /> : <Lazy />)
  return Object.assign(Page, { preload })
}

const CoursesPage = page(() => import('@/pages/courses'))
const CoursePage = page(() => import('@/pages/course'))
const InterviewPrepPage = page(() => import('@/pages/interview-prep'))
const BlogsPage = page(() => import('@/pages/blogs'))
const BlogPostPage = page(() => import('@/pages/blog-post'))
const AboutPage = page(() => import('@/pages/about'))
const ContactPage = page(() => import('@/pages/contact'))
const MyCoursesPage = page(() => import('@/pages/my-courses'))
const JoinEarnPage = page(() => import('@/pages/join-earn'))
const LoginPage = page(() => import('@/pages/login'))
const QuizPage = page(() => import('@/pages/quiz'))
const NotFoundPage = page(() => import('@/pages/not-found'))

// Fetch every page's code once the first page is idle, so later navigations never wait on the network.
window.addEventListener('load', () => {
  sessionStorage.removeItem('chunk-reload')
  const all = () => [CoursesPage, CoursePage, InterviewPrepPage, BlogsPage, BlogPostPage, AboutPage, ContactPage, MyCoursesPage, JoinEarnPage, LoginPage, QuizPage, NotFoundPage].forEach((p) => void p.preload().catch(() => {}))
  if ('requestIdleCallback' in window) requestIdleCallback(all, { timeout: 4000 })
  else setTimeout(all, 2000)
}, { once: true })

export default function App() {
  const location = useLocation()
  const dir = useNavigationType() === 'POP' ? -1 : 1
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>
        <div className="flex min-h-dvh flex-col overflow-x-clip">
          <SiteHeader />
          {/* Scroll only once the old page has faded out, so the jump to the top is never visible. */}
          <AnimatePresence mode="wait" initial={false} custom={dir} onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
            <motion.main
              id="main"
              key={location.pathname}
              className="flex-1 [&>:first-child]:pt-[4.75rem]"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Suspense fallback={<PageSkeleton />}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:slug" element={<CoursePage />} />
                  <Route path="/interview-prep" element={<InterviewPrepPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/blogs" element={<BlogsPage />} />
                  <Route path="/blogs/:slug" element={<BlogPostPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/my-courses" element={<MyCoursesPage />} />
                  <Route path="/join-earn" element={<JoinEarnPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </motion.main>
          </AnimatePresence>
          <SiteFooter />
        </div>
        <Toaster position="bottom-right" richColors closeButton />
      </TooltipProvider>
    </MotionConfig>
  )
}
