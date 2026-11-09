import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import HomePage from '@/pages/home'
import { EASE } from '@/lib/motion'

const CoursesPage = lazy(() => import('@/pages/courses'))
const CoursePage = lazy(() => import('@/pages/course'))
const InterviewPrepPage = lazy(() => import('@/pages/interview-prep'))
const BlogsPage = lazy(() => import('@/pages/blogs'))
const BlogPostPage = lazy(() => import('@/pages/blog-post'))
const AboutPage = lazy(() => import('@/pages/about'))
const ContactPage = lazy(() => import('@/pages/contact'))
const MyCoursesPage = lazy(() => import('@/pages/my-courses'))
const JoinEarnPage = lazy(() => import('@/pages/join-earn'))
const LoginPage = lazy(() => import('@/pages/login'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

export default function App() {
  const location = useLocation()
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          {/* Scroll only once the old page has faded out, so the jump to the top is never visible. */}
          <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
            <motion.main
              id="main"
              key={location.pathname}
              className="flex-1 [&>:first-child]:pt-[4.75rem]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.16, ease: 'easeOut' } }}
            >
              <Suspense fallback={<div className="min-h-[60vh]" />}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:slug" element={<CoursePage />} />
                  <Route path="/interview-prep" element={<InterviewPrepPage />} />
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
