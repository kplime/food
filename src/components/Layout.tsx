import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ObangStripe } from './ObangStripe'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../auth/AuthContext'

export function Layout() {
  const { lang, setLang, t } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b-2 border-obang-black bg-obang-white sticky top-0 z-10">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <ObangStripe className="h-3 w-9" />
            {t('brand')}
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Link
                to="/recipes"
                className="flex items-center border-2 border-obang-black px-3 py-2.5 font-bold transition-colors hover:bg-obang-black hover:text-obang-white"
              >
                {t('nav_recipes')}
              </Link>
              <Link
                to="/restaurants"
                className="flex items-center border-2 border-obang-black px-3 py-2.5 font-bold transition-colors hover:bg-obang-black hover:text-obang-white"
              >
                {t('nav_restaurants')}
              </Link>
              <Link
                to="/community"
                className="flex items-center border-2 border-obang-black px-3 py-2.5 font-bold transition-colors hover:bg-obang-black hover:text-obang-white"
              >
                {t('nav_community')}
              </Link>
            </div>

            <div className="flex items-center gap-4 border-l-2 border-obang-black/15 pl-6 text-obang-black/70">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="font-medium text-obang-black">{t('auth_greeting')(user.username)}</span>
                  <button type="button" onClick={handleLogout} className="hover:text-obang-red hover:underline">
                    {t('auth_logout')}
                  </button>
                </div>
              ) : (
                <Link to="/login" className="font-bold text-obang-black hover:text-obang-red">
                  {t('auth_login_title')}
                </Link>
              )}

              <div role="group" aria-label="Language selector" className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLang('ko')}
                  aria-pressed={lang === 'ko'}
                  className={lang === 'ko' ? 'font-bold text-obang-black' : 'hover:text-obang-black'}
                >
                  한국어
                </button>
                <span className="text-obang-black/30">·</span>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  aria-pressed={lang === 'en'}
                  className={lang === 'en' ? 'font-bold text-obang-black' : 'hover:text-obang-black'}
                >
                  EN
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t-2 border-obang-black py-6 text-center">
        <p className="text-xs text-obang-black/70">{t('footer_tagline')}</p>
        <ObangStripe className="mx-auto mt-4 h-1.5 w-24" />
      </footer>
    </div>
  )
}
