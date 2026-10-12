import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, type User } from './api'
import { invalidate } from '@/hooks/use-query'

interface AuthState {
  user: User | null
  ready: boolean
  login: (email: string, password: string) => Promise<User>
  register: (d: { name: string; email: string; password: string; referralCode?: string }) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api.me().then((r) => setUser(r.user)).catch(() => setUser(null)).finally(() => setReady(true))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await api.login(email, password)
    invalidate('me:')
    setUser(user)
    return user
  }, [])

  const register = useCallback(async (d: Parameters<AuthState['register']>[0]) => {
    const { user } = await api.register(d)
    invalidate('me:')
    setUser(user)
    return user
  }, [])

  const logout = useCallback(async () => {
    await api.logout()
    invalidate('me:')
    invalidate('course:')
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, ready, login, register, logout }), [user, ready, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
