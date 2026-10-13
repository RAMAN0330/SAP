import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { Button } from '@/components/ui/button'
import { useQuery } from '@/hooks/use-query'
import { api } from '@/lib/api'
import { formatNumber } from '@/lib/format'

const principles = [
  { title: 'Practice over theory', text: 'Every lesson maps to something a panel or a live project will actually ask of you. If it never comes up, it doesn’t make the cut.' },
  { title: 'Taught by practitioners', text: 'Mentors are working SAP consultants who interview candidates themselves, so the feedback reflects real hiring bars.' },
  { title: 'Support until you land', text: 'Résumé rebuilds, mock panels and introductions continue after the last lesson — support ends at the offer, not the syllabus.' },
]

const route = [
  ['Choose your module', 'Map your background to the module with the best odds for you.'],
  ['Build the skills', 'Configure the module and understand the business reason behind each setting.'],
  ['Practise the interview', 'Drill the question bank, then face a recorded mock panel.'],
  ['Get placed', 'Polish the résumé, reach hiring partners and walk into the offer.'],
]

export default function AboutPage() {
  const { data: stats } = useQuery('stats', api.stats)
  return (
    <>
      <PageIntro
        title="About GoLive Academy"
        lead="We help SAP aspirants go from “I know the module” to “I got the offer” — with interview-first training, honest feedback and practical job support."
      />

      <section className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Why we exist</h2>
          <div className="mt-6 max-w-[64ch] space-y-5 text-[1.08rem] leading-relaxed text-muted-foreground">
            <p>
              Plenty of SAP training teaches you where the settings live. Far less of it prepares you for the moment a panel asks you to walk through a month-end close, defend a design choice or untangle an integration failure on the spot.
            </p>
            <p>
              GoLive Academy is built around that moment. Each module pairs hands-on configuration with the scenario questions interviewers actually use, then puts you in front of a mock panel before the real one. Whether you are a fresher, switching from finance, supply chain or HR, or a consultant moving to S/4HANA or the cloud, we plan the route from where you stand today.
            </p>
          </div>
          <Button asChild className="mt-8"><Link to="/courses">Explore the courses <ArrowRight /></Link></Button>
        </div>

        <div className="on-board aurora self-start rounded-[2rem] border border-white/70 p-6 text-letter shadow-board sm:p-8">
          <dl className="grid grid-cols-2 gap-3" aria-label="The catalogue today">
            {[
              ['SAP modules', stats ? String(stats.modules) : ''],
              ['Lessons', stats ? formatNumber(stats.lessons) : ''],
              ['Interview questions', stats ? formatNumber(stats.questions) : ''],
              ['Mock panel', 'Sat 11:00'],
            ].map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[1.4rem] border border-white/80 bg-white/65 p-4 shadow-panel"
              >
                <dt className="text-sm text-letter-dim">{k}</dt>
                <dd className="mt-1 text-2xl font-extrabold tabular">{v || '—'}</dd>
              </motion.div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-letter-dim">Learner counts, ratings and placement rates will appear here once you have real numbers to publish.</p>
        </div>
      </section>

      <section className="border-y bg-[oklch(95%_0.024_292)]">
        <div className="container-page py-16 sm:py-24">
          <h2 className="text-3xl font-extrabold sm:text-4xl">How every learner progresses</h2>
          <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute top-[15px] right-0 left-0 hidden h-[3px] rounded-full bg-[repeating-linear-gradient(90deg,var(--foreground)_0_10px,transparent_10px_18px)] opacity-20 md:block" />
            {route.map(([name, text], i) => (
              <motion.li
                key={name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <span className="relative z-10 grid size-[33px] place-items-center rounded-full border-[3px] border-white bg-signal text-xs font-bold text-signal-ink shadow-panel">{i + 1}</span>
                <h3 className="mt-4 text-xl font-bold">{name}</h3>
                <p className="mt-1.5 text-muted-foreground">{text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <h2 className="text-3xl font-extrabold sm:text-4xl">What we stand for</h2>
        <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="border-t-2 border-foreground pt-5">
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-[2rem] border border-white bg-card p-6 shadow-panel sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-bold">Not sure which module fits you?</h2>
            <p className="mt-1 text-muted-foreground">Tell us your background and experience — we’ll suggest a preparation plan.</p>
          </div>
          <Button asChild><Link to="/contact">Talk to us <ArrowRight /></Link></Button>
        </div>
      </section>
    </>
  )
}
