export type Level = 'Beginner' | 'Intermediate' | 'Advanced'
export type Track = 'Functional' | 'Technical' | 'Cloud'
export type Status = 'ENROLLING' | 'FEW_SEATS' | 'OPEN'

export interface Course {
  id: string
  slug: string
  /** catalogue position (1-based) */
  catalogOrder: number
  title: string
  module: string
  track: Track
  description: string
  overview: string
  price: number
  durationWeeks: number
  level: Level
  lessonsCount: number
  questionsCount: number
  demand: 1 | 2 | 3
  /** the job the course prepares for, e.g. "FICO Consultant" */
  role: string
  instructor: { name: string; bio: string }
  learnPoints: string[]
  /** next cohort start (ISO) */
  startsAt: string
  status: Status
}
export interface Lesson { id: string; position: number; title: string; description: string; minutes: number }
export interface Question { id: string; question: string; answer: string; difficulty: 'Easy' | 'Medium' | 'Hard' }
export interface CourseDetail {
  course: Course
  lessons: Lesson[]
  questions: Question[]
  enrollment: { enrolledAt: string; completedLessonIds: string[] } | null
}
export interface BlogSummary { slug: string; title: string; excerpt: string; category: string; author: string; readMinutes: number; publishedAt: string }
export interface BlogPost extends BlogSummary { body: string[] }
export interface User { id: string; name: string; email: string; referralCode: string; createdAt: string }
export interface Enrolment {
  slug: string; title: string; module: string; catalogOrder: number; level: Level; role: string; durationWeeks: number
  enrolledAt: string; totalLessons: number; doneLessons: number
  nextLesson: { id: string; title: string; position: number } | null
}
export interface Referrals { code: string; rewardPerEnrolment: number; earned: number; friends: { name: string; joinedAt: string; enrolled: boolean }[] }
export interface Stats { modules: number; lessons: number; questions: number }

export class ApiError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`/api${path}`, {
      credentials: 'include',
      ...init,
      headers: { 'content-type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new ApiError('Can’t reach the server. Check your connection and try again.', 0)
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(body.error ?? 'Something went wrong. Please try again.', res.status)
  return body as T
}

const post = <T>(path: string, data?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(data ?? {}) })

export const api = {
  courses: () => request<Course[]>('/courses'),
  course: (slug: string) => request<CourseDetail>(`/courses/${slug}`),
  stats: () => request<Stats>('/stats'),
  blogs: () => request<BlogSummary[]>('/blogs'),
  blog: (slug: string) => request<BlogPost>(`/blogs/${slug}`),
  me: () => request<{ user: User | null }>('/auth/me'),
  login: (email: string, password: string) => post<{ user: User }>('/auth/login', { email, password }),
  register: (d: { name: string; email: string; password: string; referralCode?: string }) => post<{ user: User }>('/auth/register', d),
  logout: () => post<{ ok: true }>('/auth/logout'),
  enroll: (slug: string) => post<{ ok: true }>(`/courses/${slug}/enroll`),
  setLesson: (id: string, done: boolean) => request<{ ok: true }>(`/lessons/${id}/progress`, { method: 'PUT', body: JSON.stringify({ done }) }),
  enrolments: () => request<Enrolment[]>('/me/enrollments'),
  referrals: () => request<Referrals>('/me/referrals'),
  contact: (d: Record<string, string>) => post<{ ok: true }>('/contact', d),
}
