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
