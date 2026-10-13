import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { Clock, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { FlapText } from '@/components/board/split-flap'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { site } from '@/config/site'

const info = [
  { icon: Mail, title: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}` },
  { icon: Phone, title: 'Phone', value: site.contact.phone },
  { icon: Clock, title: 'Hours', value: site.contact.hours },
  { icon: MapPin, title: 'Where we are', value: site.contact.address },
]

export default function ContactPage() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    setBusy(true)
    setError(null)
    try {
      await api.contact(data)
      setSentTo(data.email)
      form.reset()
      toast.success('Message sent. We usually reply within one working day.')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageIntro title="Contact us" lead="Questions about a course, interview preparation or job assistance? Send a message and a mentor will reply — usually within one working day." />
      <section className="container-page grid gap-8 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div className="self-start">
          <ul className="on-board board-surface overflow-hidden rounded-xl shadow-board" aria-label="How to reach us">
            {info.map((x) => (
              <li key={x.title} className="flex items-center gap-4 border-b border-letter/10 px-5 py-4 last:border-b-0">
                <span className="sign-plate grid size-10 shrink-0 place-items-center rounded-md"><x.icon className="size-5" aria-hidden /></span>
                <div className="min-w-0">
                  <h2 className="text-sm text-letter-dim">{x.title}</h2>
                  {x.href ? <a href={x.href} className="font-semibold break-all text-letter hover:text-signal">{x.value}</a> : <p className="font-semibold text-letter">{x.value}</p>}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 px-1 text-xs text-muted-foreground">Contact details shown are placeholders.</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-panel sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {sentTo ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-h-[26rem] flex-col items-center justify-center text-center"
              >
                <div className="on-board board-surface rounded-lg p-3 text-[18px]"><FlapText text="MESSAGE SENT" length={12} tone="go" stagger={40} /></div>
                <h2 className="mt-6 text-2xl font-extrabold">Thanks — it’s on its way</h2>
                <p className="mt-2 max-w-sm text-muted-foreground">We’ll reply to <span className="font-semibold text-foreground">{sentTo}</span> within one working day.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSentTo(null)}>Send another message</Button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 sm:grid-cols-2">
                <div aria-live="assertive" className="sm:col-span-2 empty:hidden">
                  {error && <p className="rounded-md border border-destructive/30 bg-destructive/[0.06] px-3 py-2 text-sm font-medium text-destructive">{error}</p>}
                </div>
                <Field id="firstName" label="First name" required autoComplete="given-name" />
                <Field id="lastName" label="Last name" autoComplete="family-name" />
                <Field id="email" label="Email" type="email" required autoComplete="email" />
                <Field id="phone" label="Phone" type="tel" autoComplete="tel" />
                <Field id="subject" label="Subject" className="sm:col-span-2" placeholder="e.g. Which module suits a chartered accountant?" />
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                  <Textarea id="message" name="message" required minLength={10} rows={6} className="min-h-36 resize-y" />
                </div>
                <div className="flex items-center justify-between gap-4 sm:col-span-2">
                  <p className="text-xs text-muted-foreground"><span className="text-destructive">*</span> Required</p>
                  <Button type="submit" size="lg" disabled={busy}>
                    {busy ? <><Loader2 className="animate-spin" /> Sending…</> : <>Send message <Send /></>}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}

function Field({ id, label, required, className, ...rest }: { id: string; label: string; required?: boolean; className?: string } & React.ComponentProps<'input'>) {
  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      <Label htmlFor={id}>{label} {required && <span className="text-destructive">*</span>}</Label>
      <Input id={id} name={id} required={required} className="h-11" {...rest} />
    </div>
  )
}
