// Demo articles written for GoLive Academy. Author names are placeholders.
export const blogCategories = ['Interview Questions', 'Career Paths', 'Résumé & Profile', 'Mock Interviews', 'Certification', 'Job Search'] as const

export const seedBlogs = [
  {
    slug: 'fico-scenario-questions',
    title: 'The FICO scenario questions that decide the interview',
    excerpt: 'Definitions get you through the first ten minutes. Scenarios decide the offer. Here are the five that come up again and again.',
    category: 'Interview Questions', author: 'GoLive Faculty', readMinutes: 7, daysAgo: 3,
    body: [
      'Most FICO candidates prepare definitions: what a company code is, what a posting key does. Panels assume you know those. The questions that separate candidates are scenarios — situations where you have to reason across modules under time pressure.',
      'The first favourite is the unexplained GR/IR balance at month-end. Interviewers want to hear a method: analyse by vendor and purchase order, separate timing differences from genuine price or quantity variances, clear what matches and escalate what does not. Naming the report matters less than showing the sequence.',
      'The second is "walk me through a goods receipt from finance’s point of view". This tests whether you understand automatic account determination. Mention valuation class, transaction keys and the GR/IR clearing account, and you have shown you can talk to an MM consultant as an equal.',
      'Third: a period that will not close because postings keep arriving. Talk about posting period variants, who is allowed to post in a closed period, and how you would coordinate with the business rather than simply opening the period again.',
      'Fourth and fifth tend to be about the Universal Journal and about asset accounting year-end. In both cases, answer with what changed for the user, not just which table it lives in. Panels hire people who can explain the system to finance teams.',
      'Practise each scenario out loud, timed at three minutes. If you cannot finish in three minutes, your answer is a lecture, not a response.',
    ],
  },
  {
    slug: 'choosing-your-first-sap-module',
    title: 'Choosing your first SAP module without guessing',
    excerpt: 'Pick the module your background already speaks. A simple way to map your experience to demand.',
    category: 'Career Paths', author: 'GoLive Faculty', readMinutes: 6, daysAgo: 9,
    body: [
      'The fastest way into SAP is through the door your current experience already opens. A purchasing executive learning MM brings years of procure-to-pay context; the same person learning ABAP starts from zero on both the tool and the domain.',
      'Start by listing what you have done for at least a year: closing books, raising purchase orders, managing shipments, running payroll, writing code. Each maps naturally to one or two modules — FICO, MM, SD or EWM, HCM or SuccessFactors, ABAP or BTP.',
      'Then look at demand honestly. Some modules have many openings and many applicants; others have fewer roles but less competition. Freshers often do well in high-demand functional modules with clear processes such as SD or MM.',
      'Finally, check what the work feels like. Functional consultants spend their days in workshops and configuration; technical consultants spend theirs in code and integrations. Choose the day you would enjoy, not the salary table alone.',
      'If you are still undecided after this, talk to someone who works in the module. Twenty minutes with a practitioner is worth more than a week of forum threads.',
    ],
  },
  {
    slug: 'sap-resume-first-page',
    title: 'What an SAP résumé must show on page one',
    excerpt: 'Recruiters skim for module, scope, landscape and outcomes. Put all four above the fold.',
    category: 'Résumé & Profile', author: 'GoLive Faculty', readMinutes: 5, daysAgo: 14,
    body: [
      'An SAP résumé is read in under a minute, usually by someone matching it against a job description with the module name in the title. Page one has to answer four questions fast.',
      'Which module? State it in your headline, not buried in a skills list. Which scope? Name the processes you configured or supported — not every T-code you have opened. Which landscape? ECC or S/4HANA, on-premise or cloud, implementation or support. What outcome? One line per role on what improved because you were there.',
      'Career switchers should lead with domain experience framed in SAP terms. "Managed vendor payments for 400 suppliers" becomes far stronger when followed by the SAP process you now understand end to end.',
      'Cut what does not help: long objective statements, generic soft-skill lists and training courses with no project context. Keep it to two pages.',
    ],
  },
  {
    slug: 'how-to-run-a-mock-interview',
    title: 'How to run a mock interview that actually helps',
    excerpt: 'A mock is only useful if it is uncomfortable, timed and scored. A simple format you can repeat weekly.',
    category: 'Mock Interviews', author: 'GoLive Faculty', readMinutes: 6, daysAgo: 21,
    body: [
      'Most self-run mock interviews are too friendly. The interviewer reads questions from a list, the candidate answers, everyone nods. Nothing is learned.',
      'A useful mock has three properties. It is timed, so you feel the pressure of a real panel. It includes at least one scenario you have not seen before. And it ends with a written score against a rubric — technical depth, structure, communication and honesty about what you do not know.',
      'Record it. Watching yourself is uncomfortable, and that is the point: you will see filler words, rambling openings and answers that never reach a conclusion.',
      'Repeat weekly with a different interviewer when you can. Improvement shows up in the rubric scores long before it shows up in confidence.',
    ],
  },
  {
    slug: 'is-sap-certification-worth-it',
    title: 'Is SAP certification worth it for you?',
    excerpt: 'Certification helps in some situations and barely registers in others. How to decide.',
    category: 'Certification', author: 'GoLive Faculty', readMinutes: 5, daysAgo: 30,
    body: [
      'Certification is a signal, and signals matter most when you have little else to show. For freshers and career switchers without project experience, a current certification can help a résumé pass the first filter.',
      'For experienced consultants, project history usually outweighs it. Interviewers will ask what you did, not what you passed.',
      'Some employers and partners do require certification for specific roles, especially in cloud products. Check the job descriptions you are targeting before spending money.',
      'Whatever you decide, do not treat certification as interview preparation. Exams test recall; interviews test reasoning in scenarios. You need both.',
    ],
  },
  {
    slug: 'sap-job-search-that-gets-replies',
    title: 'An SAP job search that gets replies',
    excerpt: 'Applications alone rarely work. Where SAP roles come from, and how to reach the people who fill them.',
    category: 'Job Search', author: 'GoLive Faculty', readMinutes: 6, daysAgo: 40,
    body: [
      'A large share of SAP roles are filled through consultancies, implementation partners and referrals, not public job boards. If your search is only applications, you are competing in the most crowded channel.',
      'Build a target list: partners that implement your module, companies running S/4HANA programmes, and recruiters who specialise in SAP. Follow their project announcements — a new programme means hiring soon.',
      'Reach out with something specific. A short note naming the module, your relevant experience and the programme you noticed earns far more replies than a generic request.',
      'Track every conversation in a simple sheet and follow up after a week. Consistency beats intensity: ten thoughtful messages a week for two months will outperform a hundred in one weekend.',
    ],
  },
]
