const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
export const formatINR = (n: number) => inr.format(n)
export const formatNumber = (n: number) => new Intl.NumberFormat('en-IN').format(n)

const IST = 'Asia/Kolkata'
export const timeIST = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: IST }).format(new Date(iso))
/** "Sat, 2 Nov" */
export const shortDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: IST }).format(new Date(iso))
export const longDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: IST }).format(new Date(iso))
/** "Sat, 2 Nov · 15:00 IST" — a cohort's start. */
export const cohortStart = (iso: string) => `${shortDate(iso)} · ${timeIST(iso)} IST`
