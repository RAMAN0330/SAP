// Brand, contact and placeholder details live here. Anything marked placeholder must be replaced before launch.
export const site = {
  name: 'Config2Consult',
  wordmark: ['Config', '2', 'Consult'] as const,
  blurb: 'Interview-first SAP training for freshers, career switchers and working consultants — module courses, question banks, mock panels and placement help.',
  contact: {
    email: 'config2consult@gmail.com',
    phone: '+91 78271 13686',
    phoneHref: 'tel:+917827113686',
    hours: 'Mon–Sat, 10:00–19:00 IST', // not yet confirmed by the owner
    address: 'Remote-first team ∙ Gurgaon, Haryana'
  },
  trainerYears: '8',
  mockInterview: { price: 999, offer: 899, minutes: 60 },
}

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'All Courses' },
  { to: '/interview-prep', label: 'Interview Prep' },
  { to: '/quiz', label: 'SAP Quiz' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/my-courses', label: 'My Courses' },
  { to: '/join-earn', label: 'Join & Earn' },
] as const
