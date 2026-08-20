import { lazy, Suspense, useMemo, useState } from 'react'
import { restaurants } from '../data/restaurants'
import { RestaurantCard } from '../components/RestaurantCard'
import { useLanguage } from '../i18n/LanguageContext'

// Lazy-loaded: bundles the ~1,850-entry OSM dataset + Leaflet separately so they
// don't block the initial paint of this page.
const RestaurantMapSection = lazy(() =>
  import('../components/RestaurantMapSection').then((m) => ({ default: m.RestaurantMapSection })),
)

export function RestaurantListPage() {
  const { lang, t } = useLanguage()
  const [region, setRegion] = useState('all')

  const regions = useMemo(() => {
    const key = lang === 'en' ? 'regionEn' : 'region'
    return Array.from(new Set(restaurants.map((r) => r[key])))
  }, [lang])

  const filtered = useMemo(() => {
    if (region === 'all') return restaurants
    const key = lang === 'en' ? 'regionEn' : 'region'
    return restaurants.filter((r) => r[key] === region)
  }, [region, lang])

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-2xl font-black">{t('restaurants_title')}</h1>
      <p className="mt-1 text-sm text-obang-black/70">{t('restaurants_subtitle')}</p>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold">{t('restaurants_search_title')}</h2>
        <p className="mt-1 text-sm text-obang-black/70">{t('restaurants_search_subtitle')}</p>
        <div className="mt-4">
          <Suspense fallback={<div className="h-[420px] w-full animate-pulse border-2 border-obang-black bg-obang-black/5" />}>
            <RestaurantMapSection />
          </Suspense>
        </div>
      </section>

      <section className="mt-10 border-t-2 border-obang-black/10 pt-8">
        <h2 className="font-display text-lg font-bold">{t('home_restaurants')}</h2>

        <div className="mt-4">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="min-h-11 border-2 border-obang-black bg-obang-white px-3 text-sm font-bold"
          >
            <option value="all">{t('filter_region_all')}</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.slug} restaurant={restaurant} />
          ))}
        </div>

        <p className="mt-8 text-xs text-obang-black/50">{t('restaurants_source')}</p>
      </section>
    </div>
  )
}
