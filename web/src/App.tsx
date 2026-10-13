import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import HomePage from '@/pages/home'

const CoursesPage = lazy(() => import('@/pages/courses'))
const CoursePage = lazy(() => import('@/pages/course'))
const BlogsPage = lazy(() => import('@/pages/blogs'))
const BlogPostPage = lazy(() => import('@/pages/blog-post'))
const AboutPage = lazy(() => import('@/pages/about'))
const ContactPage = lazy(() => import('@/pages/contact'))
const MyCoursesPage = lazy(() => import('@/pages/my-courses'))
const JoinEarnPage = lazy(() => import('@/pages/join-earn'))
const LoginPage = lazy(() => import('@/pages/login'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <ScrollToTop />
          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              id="main"
              key={location.pathname}
              className="flex-1 [&>:first-child]:pt-[4.75rem]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              <Suspense fallback={<div className="min-h-[60vh]" />}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:slug" element={<CoursePage />} />
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
