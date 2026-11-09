// Brand, contact and placeholder details live here. Anything marked placeholder must be replaced before launch.
export const site = {
  name: 'Config2Consult',
  wordmark: ['Config', '2', 'Consult'] as const,
  blurb: 'Interview-first SAP training for freshers, career switchers and working consultants — module courses, question banks, mock panels and placement help.',
  contact: {
    email: 'hello@config2consult.example', // placeholder
    phone: '+91 90000 00000', // placeholder
    hours: 'Mon–Sat, 10:00–19:00 IST',
    address: 'Remote-first team ∙ Hyderabad, India', // placeholder
  },
  trainerYears: '8',
  mockBatch: { day: 'SAT', time: '11:00', label: 'Saturday mock panel ∙ 11:00 IST' },
}

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'All Courses' },
  { to: '/interview-prep', label: 'Interview Prep' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/my-courses', label: 'My Courses' },
  { to: '/join-earn', label: 'Join & Earn' },
] as const
