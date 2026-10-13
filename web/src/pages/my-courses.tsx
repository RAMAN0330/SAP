import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, BookOpen, LogIn } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { ModuleMark } from '@/components/course/cohort'
import { EmptyState } from '@/components/course/ghost'
import { PhaseTrack, PHASES, phaseFor } from '@/components/course/meta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useQuery } from '@/hooks/use-query'
import { api, type Enrolment } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { longDate } from '@/lib/format'

export default function MyCoursesPage() {
  const { user, ready } = useAuth()
  const { data: enrolments, loading, error, refetch } = useQuery(user ? `me:enrolments:${user.id}` : null, api.enrolments)

  if (!ready) return <div className="aurora h-80" />

  if (!user) {
    return (
      <>
        <PageIntro title="My courses" lead="Your enrolled courses, progress and next lesson — all in one place once you log in." />
        <div className="container-page py-16">
          <EmptyState icon={LogIn} title="Log in to see your courses">
            <p>Sign in to pick up where you left off, or browse the catalogue to choose your first module.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild><Link to="/login?redirect=/my-courses">Log in</Link></Button>
              <Button asChild variant="outline"><Link to="/courses">Browse courses</Link></Button>
            </div>
          </EmptyState>
        </div>
      </>
    )
  }

  const total = enrolments?.length ?? 0
  return (
    <>
      <PageIntro
        title={`Your courses, ${user.name.split(' ')[0]}`}
        lead="Every course you’re enrolled in, with the next lesson ready to go."
        aside={
          <div className="inline-flex flex-col gap-0.5 rounded-[1.5rem] border border-white/70 bg-white/60 px-5 py-3 shadow-panel backdrop-blur-md">
            <span className="text-xs font-semibold text-letter-dim">Enrolled</span>
            <span className="text-3xl font-extrabold tabular">{total}</span>
          </div>
        }
      />
      <section className="container-page py-12 sm:py-16">
        {error && <p className="text-destructive">{error.message} <button className="underline" onClick={() => refetch()}>Retry</button></p>}
        {loading && !enrolments && <div className="grid gap-4 md:grid-cols-2">{[0, 1].map((i) => <div key={i} className="h-64 animate-pulse rounded-xl bg-card" />)}</div>}
        {enrolments && enrolments.length === 0 && (
          <EmptyState icon={BookOpen} title="You haven’t enrolled in a course yet">
            <p>Pick a module that matches your background — enrolment takes one click.</p>
            <Button asChild className="mt-6"><Link to="/courses">Explore courses <ArrowRight /></Link></Button>
          </EmptyState>
        )}
        {enrolments && enrolments.length > 0 && (
          <ul className="grid gap-5 md:grid-cols-2">
            {enrolments.map((t, i) => <EnrolledCourseCard key={t.slug} enrolment={t} index={i} />)}
          </ul>
        )}
      </section>
    </>
  )
}

function EnrolledCourseCard({ enrolment: t, index }: { enrolment: Enrolment; index: number }) {
  const pct = t.totalLessons ? Math.round((t.doneLessons / t.totalLessons) * 100) : 0
  const phase = PHASES[phaseFor(t.doneLessons, t.totalLessons)]
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col overflow-hidden rounded-[1.75rem] border border-white bg-card shadow-panel"
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <ModuleMark module={t.module} index={t.catalogOrder} />
        <Badge variant={phase === 'Ready' ? 'go' : 'quiet'}>{phase}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="module">SAP {t.module}</Badge>
          <Badge variant="quiet">{t.level}</Badge>
        </div>
        <h2 className="mt-3 text-xl font-bold">{t.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enrolled {longDate(t.enrolledAt)} ∙ Goal: {t.role}</p>
        <div className="mt-5 flex items-baseline justify-between text-sm">
          <span className="font-semibold tabular">{t.doneLessons} / {t.totalLessons} lessons</span>
          <span className="text-muted-foreground tabular">{pct}%</span>
        </div>
        <PhaseTrack done={t.doneLessons} total={t.totalLessons} className="mt-3" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="min-w-0 text-sm text-muted-foreground">
            {t.nextLesson ? <>Next: <span className="font-semibold text-foreground">{t.nextLesson.title}</span></> : 'Every lesson complete — book a mock panel.'}
          </p>
          <Button asChild size="sm">
            <Link to={`/courses/${t.slug}#curriculum`}>{t.nextLesson ? 'Continue' : 'Review'} <ArrowRight /></Link>
          </Button>
        </div>
      </div>
    </motion.li>
  )
}
