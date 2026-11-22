// Course levels and what every level includes. Same structure for every module (owner's sheet, Nov 2026).
// Per-module overrides can be added to `levelOverrides` if a module ever needs different sessions or fees.

export interface CourseLevel {
  id: 1 | 2 | 3
  name: string
  tagline: string
  audience: string
  /** null = decided per topic, shown as "As per topics". */
  sessions: number | null
  /** null = quoted on request. */
  fee: number | null
  mocks: number | null
}

export const levels: CourseLevel[] = [
  {
    id: 1, name: 'Level 1', tagline: 'Basic understanding, enough to crack the interview',
    audience: 'Recommended for freshers', sessions: 10, fee: 10000, mocks: 2,
  },
  {
    id: 2, name: 'Level 2', tagline: 'Complete module course with scenario details',
    audience: 'For working professionals with 6–18 months of experience', sessions: 35, fee: 35000, mocks: 4,
  },
  {
    id: 3, name: 'Level 3', tagline: 'Advanced: ace a particular topic of the module',
    audience: 'For working professionals with 18–36 months of experience', sessions: null, fee: null, mocks: null,
  },
]

export const levelOverrides: Record<string, Partial<Record<CourseLevel['id'], Partial<CourseLevel>>>> = {}

export function levelsFor(module: string): CourseLevel[] {
  const o = levelOverrides[module] ?? {}
  return levels.map((l) => ({ ...l, ...o[l.id] }))
}

export const startingFee = (module: string) => Math.min(...levelsFor(module).map((l) => l.fee ?? Infinity))

/** Included in every level. */
export const inclusions = [
  'Course notes',
  'Interview preparation questionnaire',
  'SAP server access',
  'Mock interviews',
  'Résumé preparation support',
  'SAP Quiz access',
  'Documentation preparation',
  'Technical information pack',
  'Mentor: industry expert with 8+ years’ experience',
]

export const mentorLine = 'Industry expert with a minimum of 8 years’ SAP experience'
