import { createContext, useContext, useState, type ReactNode } from 'react'
import * as authStore from '../lib/authStore'
import type { AuthUser } from '../lib/authStore'

type AuthContextValue = {
  user: AuthUser | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(authStore.getStoredUser)

  const login = async (username: string, password: string) => {
    const loggedInUser = await authStore.login(username, password)
    setUser(loggedInUser)
  }

  const register = async (username: string, password: string) => {
    const newUser = await authStore.register(username, password)
    setUser(newUser)
  }

  const logout = () => {
    authStore.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
