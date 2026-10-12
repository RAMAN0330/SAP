const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
export const formatINR = (n: number) => inr.format(n)
export const formatNumber = (n: number) => new Intl.NumberFormat('en-IN').format(n)

const IST = 'Asia/Kolkata'
export const boardTime = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: IST }).format(new Date(iso))
export const boardDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', timeZone: IST }).format(new Date(iso)).toUpperCase()
export const longDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: IST }).format(new Date(iso))
export const gateCode = (gate: number) => `G${String(gate).padStart(2, '0')}`
export const flightCode = (gate: number) => `GL ${100 + gate * 7}`

// Departure boards abbreviate rather than clip: shorten step by step until it fits.
const ABBREVIATIONS: [RegExp, string][] = [
  [/SUCCESSFACTORS/, 'SF'], [/INTEGRATION/, 'CPI'], [/ADMINISTRATOR/, 'ADMIN'], [/DEVELOPER/, 'DEV'],
  [/CONSULTANT/, 'CONSULT'], [/CONSULT\b/, 'CONS'], [/SECURITY/, 'SEC'], [/S\/4HANA/, 'S4'],
]
export function boardName(text: string, max: number) {
  let s = text.toUpperCase()
  for (const [re, short] of ABBREVIATIONS) {
    if (s.length <= max) break
    s = s.replace(re, short)
  }
  return s.slice(0, max)
}
