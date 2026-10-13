import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { FlapText } from '@/components/board/split-flap'
import { GhostBoard } from '@/components/course/ghost'
import { PhaseTrack, PHASES, phaseFor } from '@/components/course/meta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useQuery } from '@/hooks/use-query'
import { api, type Trip } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { gateCode, longDate } from '@/lib/format'

export default function MyCoursesPage() {
  const { user, ready } = useAuth()
  const { data: trips, loading, error, refetch } = useQuery(user ? `me:trips:${user.id}` : null, api.trips)

  if (!ready) return <div className="board-surface h-80" />

  if (!user) {
    return (
      <>
        <PageIntro title="My courses" lead="Your enrolled courses, progress and next stop — all in one place once you log in." />
        <div className="container-page py-16">
          <GhostBoard readout="NO PASSENGER" title="Log in to see your trips">
            <p>Sign in to pick up where you left off, or browse the board to choose your first module.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild><Link to="/login?redirect=/my-courses">Log in</Link></Button>
              <Button asChild variant="outline"><Link to="/courses">Browse courses</Link></Button>
            </div>
          </GhostBoard>
        </div>
      </>
    )
  }

  const total = trips?.length ?? 0
  return (
    <>
      <PageIntro
        title={`Your trips, ${user.name.split(' ')[0]}`}
        lead="Every course you’re enrolled in, with the next stop ready to go."
        aside={
          <div className="board-surface inline-flex flex-col gap-1 rounded-lg p-3 ring-1 ring-white/70">
            <span className="font-mono text-[0.62rem] tracking-[0.16em] text-letter-dim uppercase">Booked</span>
            <span className="text-[20px]"><FlapText text={`${String(total).padStart(2, '0')} ${total === 1 ? 'TRIP' : 'TRIPS'}`} length={8} tone="signal" label={`${total} ${total === 1 ? 'course' : 'courses'}`} /></span>
          </div>
        }
      />
      <section className="container-page py-12 sm:py-16">
        {error && <p className="text-destructive">{error.message} <button className="underline" onClick={() => refetch()}>Retry</button></p>}
        {loading && !trips && <div className="grid gap-4 md:grid-cols-2">{[0, 1].map((i) => <div key={i} className="h-64 animate-pulse rounded-xl bg-card" />)}</div>}
        {trips && trips.length === 0 && (
          <GhostBoard readout="NO TRIPS YET" title="You haven’t boarded a course yet">
            <p>Pick a module that matches your background — enrolment takes one click.</p>
            <Button asChild className="mt-6"><Link to="/courses">Find your gate <ArrowRight /></Link></Button>
          </GhostBoard>
        )}
        {trips && trips.length > 0 && (
          <ul className="grid gap-5 md:grid-cols-2">
            {trips.map((t, i) => <TripCard key={t.slug} trip={t} index={i} />)}
          </ul>
        )}
      </section>
    </>
  )
}

function TripCard({ trip: t, index }: { trip: Trip; index: number }) {
  const pct = t.totalLessons ? Math.round((t.doneLessons / t.totalLessons) * 100) : 0
  const phase = PHASES[phaseFor(t.doneLessons, t.totalLessons)]
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-panel"
    >
      <div className="on-board board-surface flex items-center justify-between px-5 py-3.5">
        <span className="text-[17px]"><FlapText text={gateCode(t.gate)} length={3} tone="signal" delay={index * 80} /></span>
        <span className="text-[13px]"><FlapText text={phase} length={9} tone={phase === 'Landed' ? 'go' : 'letter'} delay={index * 80 + 100} align="right" /></span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="gate">SAP {t.module}</Badge>
          <Badge variant="quiet">{t.level}</Badge>
        </div>
        <h2 className="mt-3 text-xl font-bold">{t.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enrolled {longDate(t.enrolledAt)} ∙ To: {t.destination}</p>
        <div className="mt-5 flex items-baseline justify-between text-sm">
          <span className="font-semibold tabular">{t.doneLessons} / {t.totalLessons} stops</span>
          <span className="text-muted-foreground tabular">{pct}%</span>
        </div>
        <PhaseTrack done={t.doneLessons} total={t.totalLessons} className="mt-3" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="min-w-0 text-sm text-muted-foreground">
            {t.nextLesson ? <>Next: <span className="font-semibold text-foreground">{t.nextLesson.title}</span></> : 'Every stop complete — book a mock panel.'}
          </p>
          <Button asChild size="sm">
            <Link to={`/courses/${t.slug}#itinerary`}>{t.nextLesson ? 'Continue' : 'Review'} <ArrowRight /></Link>
          </Button>
        </div>
      </div>
    </motion.li>
  )
}
