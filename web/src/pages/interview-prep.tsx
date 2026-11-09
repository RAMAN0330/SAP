import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, ClipboardCheck, FileQuestion, Target } from 'lucide-react'
import { ModuleMark } from '@/components/course/cohort'
import { PageIntro } from '@/components/layout/page-intro'
import { Button } from '@/components/ui/button'
import { useQuery } from '@/hooks/use-query'
import { api } from '@/lib/api'
import { formatNumber } from '@/lib/format'
import { site } from '@/config/site'
import { EASE } from '@/lib/motion'

const steps = [
  { icon: FileQuestion, title: 'Work the question bank', text: 'Scenario questions with model answers, grouped the way panels ask them.' },
  { icon: ClipboardCheck, title: 'Sit a mock panel', text: `Recorded rounds every Saturday at ${site.mockBatch.time} IST, scored on a written rubric.` },
  { icon: Target, title: 'Fix the gaps', text: 'A short plan for the answers that went vague, then go again.' },
]

export default function InterviewPrepPage() {
  const { data: courses } = useQuery('courses', api.courses)
  const { data: stats } = useQuery('stats', api.stats)
  const byOrder = [...(courses ?? [])].sort((a, b) => a.catalogOrder - b.catalogOrder)

  return (
    <>
      <PageIntro
        title="Interview prep"
        lead="Question banks for every module, mock panels on a written rubric and feedback you can act on — so the real interview feels like a rerun."
        aside={
          <dl className="grid grid-cols-2 gap-2 rounded-[1.5rem] border border-white/70 bg-white/55 p-4 text-sm shadow-panel backdrop-blur-md">
            {[
              ['Questions', stats ? formatNumber(stats.questions) : '—'],
              ['Mock panel', `${site.mockBatch.day} ${site.mockBatch.time}`],
            ].map(([k, v]) => (
              <div key={k} className="px-1">
                <dt className="font-mono text-[0.62rem] tracking-[0.16em] text-letter-dim uppercase">{k}</dt>
                <dd className="mt-1 text-lg font-bold tabular text-letter">{v}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/contact">Book a mock interview <ArrowRight /></Link></Button>
        </div>
      </PageIntro>

      <section className="container-page py-16 sm:py-24">
        <h2 className="text-3xl font-extrabold sm:text-[2.6rem]">Three steps, repeated until it sticks.</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              className="rounded-[1.75rem] border border-white bg-card p-6 shadow-panel"
            >
              <span className="sign-plate grid size-11 place-items-center rounded-2xl"><s.icon className="size-5" strokeWidth={2.2} aria-hidden /></span>
              <h3 className="mt-4 text-lg font-bold"><span className="mr-1.5 font-mono text-sm text-signal">0{i + 1}</span>{s.title}</h3>
              <p className="mt-1.5 text-muted-foreground">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="border-y bg-band">
        <div className="container-page py-16 sm:py-24">
          <h2 className="text-3xl font-extrabold sm:text-[2.6rem]">Question banks by module</h2>
          <p className="mt-3 max-w-[52ch] text-lg text-muted-foreground">Open a module to read its sample questions and model answers.</p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {!courses && Array.from({ length: 6 }, (_, i) => <li key={i} className="h-[4.75rem] animate-pulse rounded-[1.5rem] bg-card" />)}
            {byOrder.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/courses/${c.slug}`}
                  className="group flex items-center gap-4 rounded-[1.5rem] border border-white bg-card p-4 shadow-panel transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <ModuleMark module={c.module} index={c.catalogOrder} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">SAP {c.module}</span>
                    <span className="block truncate text-sm text-muted-foreground tabular">{formatNumber(c.questionsCount)} interview questions</span>
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
