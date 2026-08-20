import { useMemo, useState } from 'react'
import { osmRestaurants } from '../data/restaurantsOsm'
import { RestaurantMap } from './RestaurantMap'
import { expandSearchToken } from '../data/dishSynonyms'
import { useLanguage } from '../i18n/LanguageContext'

const MAX_RESULTS = 100

// The map + nationwide search widget. Lazy-loaded from RestaurantListPage so the
// ~1,850-entry OSM dataset and Leaflet don't block the initial page paint.
export function RestaurantMapSection() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return []

    // Each token (e.g. "LA", "칼국수") must match *something* about the
    // restaurant — but a token can match via any of its expanded aliases
    // (city abbreviations, romanized dish names), not just its literal text.
    return osmRestaurants.filter((r) => {
      const haystack = [r.name, r.city, r.state, r.address].filter(Boolean).join(' ').toLowerCase()
      return tokens.every((token) => expandSearchToken(token).some((alias) => haystack.includes(alias)))
    })
  }, [query])

  const shown = filtered.slice(0, MAX_RESULTS)
  const mapRestaurants = query.trim() ? filtered : osmRestaurants

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search_placeholder')}
        className="min-h-11 w-full border-2 border-obang-black bg-obang-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-obang-red"
      />

      <div className="mt-4">
        <RestaurantMap restaurants={mapRestaurants} />
      </div>

      {query.trim() && (
        <>
          <p className="mt-3 text-xs text-obang-black/60">
            {filtered.length > MAX_RESULTS
              ? t('search_too_many')(shown.length, filtered.length)
              : t('search_results_count')(filtered.length)}
          </p>

          <div className="mt-4 divide-y divide-obang-black/15 border-2 border-obang-black">
            {shown.length === 0 && <p className="p-5 text-sm text-obang-black/60">{t('search_no_results')}</p>}
            {shown.map((r) => (
              <div key={r.osmId} className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display font-bold">{r.name}</h3>
                  {r.state && (
                    <span className="shrink-0 text-xs text-obang-black/60">
                      {r.city ? `${r.city}, ${r.state}` : r.state}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-0.5 text-sm text-obang-black/70">
                  {r.address && <div>{r.address}</div>}
                  <div className="flex flex-wrap gap-x-3">
                    {r.phone && <span>{r.phone}</span>}
                    {r.website && (
                      <a href={r.website} target="_blank" rel="noreferrer" className="text-obang-red hover:underline">
                        {r.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="mt-4 text-xs text-obang-black/50">{t('osm_source')}</p>
    </div>
  )
}
