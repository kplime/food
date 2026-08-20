import { Link, useParams } from 'react-router-dom'
import { getRecipeBySlug } from '../data/recipes'
import { AccentDot } from '../components/AccentDot'
import { useLanguage } from '../i18n/LanguageContext'

export function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const recipe = slug ? getRecipeBySlug(slug) : undefined
  const { lang, t } = useLanguage()

  if (!recipe) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="text-obang-black/70">{t('recipe_not_found')}</p>
        <Link to="/recipes" className="mt-3 inline-block text-obang-red hover:underline">
          {t('back_to_recipes')}
        </Link>
      </div>
    )
  }

  const tagline = lang === 'en' ? recipe.taglineEn : recipe.tagline
  const steps = lang === 'en' ? recipe.stepsEn : recipe.steps
  const chefTip = lang === 'en' ? recipe.chefTipEn : recipe.chefTip

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link
        to="/recipes"
        className="inline-flex items-center py-2 text-sm text-obang-black/70 hover:text-obang-red"
      >
        {t('back_to_list')}
      </Link>

      <div className="mt-3 flex items-center gap-2 text-xs text-obang-black/70">
        <AccentDot accent={recipe.accent} />
        {t('minutes_servings')(recipe.minutes, recipe.servings)}
      </div>
      <h1 className="mt-2 font-display text-3xl font-black">
        {recipe.title}
        <span className="ml-2 text-lg font-normal text-obang-black/70">{recipe.titleKo}</span>
      </h1>
      <p className="mt-2 text-obang-black/70">{tagline}</p>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold">{t('ingredients_title')}</h2>
        <ul className="mt-3 divide-y divide-obang-black/15 border-2 border-obang-black">
          {recipe.ingredients.map((ing) => (
            <li key={ing.name} className="p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{lang === 'en' ? ing.nameEn : ing.name}</span>
                <span className="text-sm text-obang-black/70">{lang === 'en' ? ing.amountEn : ing.amount}</span>
              </div>
              {ing.localSub && (
                <p className="mt-1.5 text-sm text-obang-blue">
                  <span className="mr-1.5 inline-block border border-obang-blue px-1.5 py-0.5 text-[10px] font-bold">
                    {t('local_sub_badge')}
                  </span>
                  {lang === 'en' ? ing.localSubEn : ing.localSub}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold">{t('steps_title')}</h2>
        <ol className="mt-3 space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-obang-red text-xs font-bold text-obang-white">
                {i + 1}
              </span>
              <p className="text-obang-black/80">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 border-2 border-obang-black bg-obang-yellow p-5">
        <h2 className="font-display text-sm font-bold text-obang-black">{t('chef_tip_title')}</h2>
        <p className="mt-1 text-sm text-obang-black/80">{chefTip}</p>
      </section>
    </div>
  )
}
