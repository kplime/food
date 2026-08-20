import { Link } from 'react-router-dom'
import type { Recipe } from '../data/recipes'
import { useLanguage } from '../i18n/LanguageContext'

const TAG_KEY: Record<string, 'tag_vegetarian' | 'tag_vegan' | 'tag_wellness' | 'tag_spicy' | 'tag_quick'> = {
  vegetarian: 'tag_vegetarian',
  vegan: 'tag_vegan',
  wellness: 'tag_wellness',
  spicy: 'tag_spicy',
  quick: 'tag_quick',
}

const ACCENT_BAR_CLASS: Record<string, string> = {
  blue: 'bg-obang-blue',
  red: 'bg-obang-red',
  yellow: 'bg-obang-yellow',
  white: 'bg-obang-white border-b-2 border-obang-black',
  black: 'bg-obang-black',
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { lang, t } = useLanguage()
  const tagline = lang === 'en' ? recipe.taglineEn : recipe.tagline

  return (
    <Link
      to={`/recipes/${recipe.slug}`}
      className="group block border-2 border-obang-black bg-obang-white shadow-hard transition-[transform,box-shadow] duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
    >
      <div className={`h-2 w-full ${ACCENT_BAR_CLASS[recipe.accent]}`} />
      <div className="p-5">
        <div className="text-xs font-medium text-obang-black/70">
          {t('minutes_servings')(recipe.minutes, recipe.servings)}
        </div>
        <h3 className="mt-2 font-display text-xl font-bold group-hover:text-obang-red transition-colors">
          {recipe.title}
          <span className="ml-2 text-sm font-normal text-obang-black/70">{recipe.titleKo}</span>
        </h3>
        <p className="mt-1 text-sm text-obang-black/70">{tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-obang-black/30 px-2.5 py-0.5 text-xs font-medium text-obang-black/70"
            >
              {t(TAG_KEY[tag])}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
