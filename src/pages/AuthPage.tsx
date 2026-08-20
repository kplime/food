import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

type Mode = 'login' | 'register'

export function AuthPage({ initialMode }: { initialMode: Mode }) {
  const { t } = useLanguage()
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(username, password)
      } else {
        await register(username, password)
      }
      navigate('/community')
    } catch (err) {
      const fallback = mode === 'login' ? t('auth_login_error') : t('auth_register_error')
      setError(err instanceof Error && mode === 'register' && err.message ? err.message : fallback)
    } finally {
      setSubmitting(false)
    }
  }

  const tabClass = (active: boolean) =>
    `flex-1 min-h-11 border-2 border-obang-black text-sm font-bold transition-colors ${
      active ? 'bg-obang-black text-obang-white' : 'bg-obang-white text-obang-black hover:bg-obang-black/10'
    }`

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <div className="flex gap-2">
        <button type="button" onClick={() => switchMode('login')} className={tabClass(mode === 'login')}>
          {t('auth_login_title')}
        </button>
        <button type="button" onClick={() => switchMode('register')} className={tabClass(mode === 'register')}>
          {t('auth_register_title')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('auth_username_placeholder')}
          autoComplete="username"
          maxLength={30}
          className="min-h-11 w-full border-2 border-obang-black px-3 text-sm outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth_password_placeholder')}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          className="min-h-11 w-full border-2 border-obang-black px-3 text-sm outline-none"
        />
        {error && <p className="text-sm text-obang-red">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="min-h-11 w-full border-2 border-obang-black bg-obang-red text-sm font-bold text-obang-white hover:bg-obang-black disabled:opacity-50"
        >
          {mode === 'login' ? t('auth_login_submit') : t('auth_register_submit')}
        </button>
      </form>
    </div>
  )
}
