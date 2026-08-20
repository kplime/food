// Auth data layer — talks to the Django accounts API (backend/accounts) and
// keeps the JWT + current user cached in localStorage between page loads.

export type AuthUser = {
  id: number
  username: string
}

const AUTH_BASE = (import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '/api/auth')
const ACCESS_KEY = 'obang-auth-access'
const REFRESH_KEY = 'obang-auth-refresh'
const USER_KEY = 'obang-auth-user'

async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${AUTH_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || `Auth error ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function getAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_KEY)
}

export function getStoredUser(): AuthUser | null {
  const raw = window.localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function persistSession(user: AuthUser, access: string, refresh: string) {
  window.localStorage.setItem(ACCESS_KEY, access)
  window.localStorage.setItem(REFRESH_KEY, refresh)
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export async function register(username: string, password: string): Promise<AuthUser> {
  const data = await authFetch<{ user: AuthUser; access: string; refresh: string }>('/register/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  persistSession(data.user, data.access, data.refresh)
  return data.user
}

export async function login(username: string, password: string): Promise<AuthUser> {
  const tokens = await authFetch<{ access: string; refresh: string }>('/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  const user = await authFetch<AuthUser>('/me/', {
    headers: { Authorization: `Bearer ${tokens.access}` },
  })
  persistSession(user, tokens.access, tokens.refresh)
  return user
}

export function logout() {
  window.localStorage.removeItem(ACCESS_KEY)
  window.localStorage.removeItem(REFRESH_KEY)
  window.localStorage.removeItem(USER_KEY)
}
