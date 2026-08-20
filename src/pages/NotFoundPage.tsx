import { Link } from 'react-router-dom'
import { ObangStripe } from '../components/ObangStripe'
import { useLanguage } from '../i18n/LanguageContext'

export function NotFoundPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <ObangStripe className="mx-auto mb-6 h-3 w-32" />
      <h1 className="font-display text-2xl font-black">{t('notfound_title')}</h1>
      <p className="mt-2 text-obang-black/70">{t('notfound_desc')}</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center border-2 border-obang-black bg-obang-white px-5 py-2.5 text-sm font-bold shadow-hard transition-[transform,box-shadow] duration-100 hover:bg-obang-black hover:text-obang-white active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        {t('back_home')}
      </Link>
    </div>
  )
}
