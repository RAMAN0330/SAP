import nodemailer from 'nodemailer'

// Email one-time codes. Configure SMTP_* (e.g. Gmail with an app password); without it, OTP is switched off
// and sign-up works as before. OTP_DEV_LOG=1 turns OTP on locally and prints codes to the console instead.
const host = process.env.SMTP_HOST ?? 'smtp.gmail.com'
const port = Number(process.env.SMTP_PORT ?? 465)
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const from = process.env.MAIL_FROM ?? (user ? `Config2Consult <${user}>` : 'Config2Consult')
const devLog = process.env.OTP_DEV_LOG === '1'

const transport = user && pass ? nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } }) : null

export const emailOtpEnabled = Boolean(transport) || devLog

export async function sendCode(to: string, code: string, purpose: 'register' | 'login') {
  const subject = purpose === 'register' ? `${code} is your Config2Consult verification code` : `${code} is your Config2Consult login code`
  const intro = purpose === 'register' ? 'Use this code to verify your email and finish creating your account.' : 'Use this code to log in to your account.'
  if (!transport) {
    console.log(`[otp] ${purpose} code for ${to}: ${code}`)
    return
  }
  await transport.sendMail({
    from, to, subject,
    text: `${intro}\n\n${code}\n\nThe code expires in 10 minutes. If you didn't ask for it, you can ignore this email.`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:480px">
      <p>${intro}</p>
      <p style="font-size:32px;font-weight:700;letter-spacing:6px;margin:24px 0">${code}</p>
      <p style="color:#555">The code expires in 10 minutes. If you didn't ask for it, you can ignore this email.</p>
      <p style="color:#555">Config2Consult</p></div>`,
  })
}

export type ContactMessage = { firstName: string; lastName?: string; email: string; phone?: string; subject?: string; message: string }

// Contact-form alerts to the team: email to CONTACT_TO (via the SMTP above) and WhatsApp via CallMeBot's free API
// (WHATSAPP_PHONE + WHATSAPP_APIKEY; the key comes from messaging CallMeBot once from that phone). Either is skipped when unset.
const contactTo = process.env.CONTACT_TO ?? user
const waPhone = process.env.WHATSAPP_PHONE?.replace(/[^\d]/g, '')
const waKey = process.env.WHATSAPP_APIKEY

export function contactText(m: ContactMessage) {
  const head = [
    `New contact message from ${[m.firstName, m.lastName].filter(Boolean).join(' ')}`,
    `Email: ${m.email}`,
    m.phone && `Phone: ${m.phone}`,
    m.subject && `Subject: ${m.subject}`,
  ].filter(Boolean)
  return `${head.join('\n')}\n\n${m.message}`
}

export async function notifyContact(m: ContactMessage) {
  const text = contactText(m)
  const jobs: Promise<unknown>[] = []
  if (transport && contactTo) {
    jobs.push(transport.sendMail({ from, to: contactTo, replyTo: m.email, subject: `Contact: ${m.subject || m.firstName}`, text }))
  }
  if (waPhone && waKey) {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${waPhone}&apikey=${encodeURIComponent(waKey)}&text=${encodeURIComponent(text)}`
    jobs.push(fetch(url, { signal: AbortSignal.timeout(15_000) }).then((r) => { if (!r.ok) throw new Error(`CallMeBot ${r.status}`) }))
  }
  if (!jobs.length) console.log(`[contact] no email/WhatsApp configured; message from ${m.email} saved only`)
  for (const r of await Promise.allSettled(jobs)) if (r.status === 'rejected') console.error('[contact] notify failed:', r.reason)
}
