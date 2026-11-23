import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Check, ClipboardCheck, Clock, FileQuestion, Target } from 'lucide-react'
import { ModuleMark } from '@/components/course/cohort'
import { PageIntro } from '@/components/layout/page-intro'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useQuery } from '@/hooks/use-query'
import { api } from '@/lib/api'
import { formatINR, formatNumber } from '@/lib/format'
import { site } from '@/config/site'
import { EASE } from '@/lib/motion'

const steps = [
  { icon: FileQuestion, title: 'Work the question bank', text: 'Scenario questions with model answers, grouped the way panels ask them.' },
  { icon: ClipboardCheck, title: 'Sit a mock interview', text: 'A one-hour session with an industry expert, scored on a written rubric.' },
  { icon: Target, title: 'Fix the gaps', text: 'A short plan for the answers that went vague, then go again.' },
]

const mockAgenda = [
  { min: 25, title: 'Mock interview', text: 'A realistic round on your module, at your level, with an industry expert.' },
  { min: 30, title: 'Gap discussion', text: 'Every answer that went wrong or vague, why, and how to answer it next time.' },
  { min: 5, title: 'Résumé discussion', text: 'What your résumé should say so it matches how you interview.' },
]

const mockIncludes = [
  'Module question bank included',
  'Written feedback summary after the session',
  'Session recording to review later (online sessions)',
]

const rounds = [
  {
    name: 'Screening call', time: '15–20 min', who: 'Recruiter or HR',
    tests: 'Your module, years of experience, notice period, location and salary expectations.',
    tip: 'Have a 60-second introduction ready that names your module, one project or process you know well, and why you chose SAP.',
  },
  {
    name: 'Technical round', time: '45–60 min', who: 'Senior consultant from your module',
    tests: 'Core configuration, key transactions and tables, and how your module integrates with the others.',
    tip: 'Answer with the business reason first, then the setting. “We needed X, so we configured Y in Z” beats a list of transaction codes.',
  },
  {
    name: 'Scenario round', time: '30–45 min', who: 'Project or delivery manager',
    tests: 'Support tickets, go-live problems and change requests: how you think under pressure, not what you memorised.',
    tip: 'Talk through how you would investigate before you jump to a fix. Panels reward a clear method over a lucky guess.',
  },
  {
    name: 'Managerial / client round', time: '20–30 min', who: 'Practice head or client lead',
    tests: 'Communication, handling a difficult stakeholder, estimating work and fitting into a project team.',
    tip: 'Use real examples from your current job. Domain experience counts here, even if it was outside SAP.',
  },
]

const rubric = [
  { name: 'Technical depth', strong: 'Names the right configuration and explains why it is set that way.', weak: 'Lists transaction codes without saying what they do.' },
  { name: 'Structure', strong: 'Answers in a clear order: situation, approach, result.', weak: 'Starts in the middle and circles back.' },
  { name: 'Integration thinking', strong: 'Says what happens in the neighbouring modules and in finance.', weak: 'Treats the module as if it runs alone.' },
  { name: 'Communication', strong: 'Plain language, checks the panel is following, admits what it doesn’t know.', weak: 'Jargon, guesses presented as facts.' },
]

const method = [
  { step: 'Restate', text: 'Repeat the problem in one line so the panel knows you heard it, and ask one clarifying question if you need to.' },
  { step: 'Investigate', text: 'Say where you would look first and why: the document, the log, the configuration, the master data.' },
  { step: 'Fix', text: 'Give the fix, and say who you would involve if it touches another module or needs a transport.' },
  { step: 'Prevent', text: 'Close with how you would stop it happening again: a check, a report, documentation or training.' },
]

const prepFaq = [
  { q: 'How many questions should I practise before an interview?', a: 'Depth matters more than count. Being able to answer 60–80 core questions out loud, clearly and in under three minutes each, prepares you better than reading 400.' },
  { q: 'Is the mock interview recorded?', a: 'Online sessions can be recorded so you can review your answers later, and you get a written summary of what to fix.' },
  { q: 'I have no project experience. What do I say?', a: 'Talk about the exercises and scenarios you configured in the practice system, and about the business process you know from your current job. Panels respect honesty; they do not respect invented projects.' },
  { q: 'Can I book a mock panel without enrolling in a course?', a: 'Yes. Contact us with your module and experience, and we will offer the next available slot.' },
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
              ['Mock interview', formatINR(site.mockInterview.offer)],
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

      <MockOffer />

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

      <section className="container-page py-16 sm:py-24">
        <h2 className="text-3xl font-extrabold sm:text-[2.6rem]">How an SAP interview usually runs</h2>
        <p className="mt-3 max-w-[60ch] text-lg text-muted-foreground">
          Most SAP hiring follows four rounds, though smaller firms often combine them. Here is what each one tests and how to prepare.
        </p>
        <ol className="mt-10 grid gap-4 lg:grid-cols-2">
          {rounds.map((r, i) => (
            <li key={r.name} className="rounded-[1.75rem] border border-white bg-card p-6 shadow-panel">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold"><span className="mr-1.5 font-mono text-sm text-signal">0{i + 1}</span>{r.name}</h3>
                <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground"><Clock className="size-3.5" aria-hidden />{r.time}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">With: {r.who}</p>
              <p className="mt-4 text-[0.95rem] leading-relaxed"><span className="font-semibold">What it tests: </span><span className="text-muted-foreground">{r.tests}</span></p>
              <p className="mt-3 rounded-2xl bg-band px-4 py-3 text-[0.95rem] leading-relaxed"><span className="font-semibold">Tip: </span><span className="text-muted-foreground">{r.tip}</span></p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y bg-band">
        <div className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-[2.2rem]">How mock panels are scored</h2>
            <p className="mt-3 text-lg text-muted-foreground">Every answer is marked from 1 to 4 on the same four areas a real panel weighs.</p>
            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white bg-card shadow-panel">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Mock panel scoring rubric</caption>
                <thead className="bg-board/60">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Area</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Scores 4 when…</th>
                    <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">Scores 1 when…</th>
                  </tr>
                </thead>
                <tbody>
                  {rubric.map((r) => (
                    <tr key={r.name} className="border-t align-top">
                      <th scope="row" className="px-4 py-3 font-semibold">{r.name}</th>
                      <td className="px-4 py-3 text-muted-foreground">{r.strong}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{r.weak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold sm:text-[2.2rem]">Answering a scenario question</h2>
            <p className="mt-3 text-lg text-muted-foreground">A four-step pattern that keeps you out of rambling, with a worked example.</p>
            <ol className="mt-8 space-y-3">
              {method.map((m, i) => (
                <li key={m.step} className="flex gap-4 rounded-[1.5rem] border border-white bg-card px-5 py-4 shadow-panel">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-signal font-mono text-xs font-semibold text-signal-ink">{i + 1}</span>
                  <p className="text-[0.95rem] leading-relaxed"><span className="font-bold">{m.step}. </span><span className="text-muted-foreground">{m.text}</span></p>
                </li>
              ))}
            </ol>
            <figure className="mt-6 rounded-[1.5rem] border border-dashed border-signal/40 bg-card/70 p-5">
              <figcaption className="font-mono text-[0.62rem] tracking-[0.16em] text-signal uppercase">Worked example ∙ SD</figcaption>
              <p className="mt-2 font-semibold">“A sales order shows the wrong price. What do you do?”</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                “So the order priced differently from what the customer agreed. I’d first open the pricing analysis on the item to see which condition
                record was picked and from which access sequence. If an older record is still valid, I’d correct its validity with the pricing team and
                reprice the order. To prevent it, I’d suggest a condition-record review before each price change goes live.”
              </p>
            </figure>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 className="text-3xl font-extrabold sm:text-[2.2rem]">Interview prep questions</h2>
          <p className="mt-3 text-lg text-muted-foreground">What learners ask most before booking a panel.</p>
          <Button asChild size="lg" className="mt-6"><Link to="/contact">Book a mock interview <ArrowRight /></Link></Button>
        </div>
        <Accordion type="single" collapsible className="rounded-xl border bg-card px-5 shadow-panel">
          {prepFaq.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="py-5 text-left text-[1rem] font-semibold hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-[0.98rem] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  )
}

function MockOffer() {
  const { price, offer, minutes } = site.mockInterview
  const off = Math.round((1 - offer / price) * 100)
  return (
    <section className="container-page pt-16 sm:pt-24" aria-labelledby="mock-h">
      <div className="grid gap-8 rounded-[2rem] border border-white bg-card p-6 shadow-board sm:p-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-12">
        <div>
          <h2 id="mock-h" className="text-3xl font-extrabold sm:text-[2.4rem]">One-hour mock interview</h2>
          <p className="mt-3 max-w-[56ch] text-lg text-muted-foreground">Rehearse the real thing with an industry expert, then spend most of the hour fixing what went wrong.</p>
          <ol className="mt-8 space-y-3">
            {mockAgenda.map((a) => (
              <li key={a.title} className="flex gap-4 rounded-[1.25rem] bg-band px-4 py-3.5">
                <span className="w-14 shrink-0 font-mono text-sm font-semibold text-signal tabular">{a.min} min</span>
                <p className="text-[0.95rem] leading-relaxed"><span className="font-bold">{a.title}. </span><span className="text-muted-foreground">{a.text}</span></p>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col justify-center rounded-[1.5rem] bg-board/70 p-6 shadow-press">
          <span className="self-start rounded-full bg-call/15 px-3 py-1 text-xs font-bold text-call">{off}% off ∙ limited period</span>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tracking-tight tabular">{formatINR(offer)}</span>
            <span className="text-lg text-muted-foreground line-through tabular" aria-label={`was ${formatINR(price)}`}>{formatINR(price)}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">per {minutes}-minute session</p>
          <ul className="mt-5 space-y-2 text-sm">
            {mockIncludes.map((x) => (
              <li key={x} className="flex items-start gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-go" strokeWidth={3} aria-hidden />{x}</li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-6 w-full"><Link to="/contact?subject=Book%20a%20mock%20interview">Book for {formatINR(offer)} <ArrowRight /></Link></Button>
        </div>
      </div>
    </section>
  )
}
