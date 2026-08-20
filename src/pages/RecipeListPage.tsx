import { useMemo, useState } from 'react'
import { recipes } from '../data/recipes'
import { RecipeCard } from '../components/RecipeCard'
import { useLanguage } from '../i18n/LanguageContext'

const FILTERS = [
  { key: 'all', labelKey: 'filter_all' },
  { key: 'vegetarian', labelKey: 'filter_vegetarian' },
  { key: 'vegan', labelKey: 'filter_vegan' },
  { key: 'wellness', labelKey: 'filter_wellness' },
  { key: 'spicy', labelKey: 'filter_spicy' },
  { key: 'quick', labelKey: 'filter_quick' },
] as const

export function RecipeListPage() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return recipes
    return recipes.filter((r) => r.tags.includes(filter))
  }, [filter])

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-2xl font-black">{t('recipes_title')}</h1>
      <p className="mt-1 text-sm text-obang-black/70">{t('recipes_subtitle')}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`inline-flex min-h-11 items-center justify-center rounded-full border-2 px-4 text-sm font-bold transition-colors ${
              filter === f.key
                ? 'border-obang-black bg-obang-black text-obang-white'
                : 'border-obang-black/30 text-obang-black/70 hover:border-obang-black hover:text-obang-black'
            }`}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {filtered.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}
