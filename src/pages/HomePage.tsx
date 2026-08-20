import { Link } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { restaurants } from '../data/restaurants'
import { RecipeCard } from '../components/RecipeCard'
import { RestaurantCard } from '../components/RestaurantCard'
import { ObangStripe } from '../components/ObangStripe'
import { useLanguage } from '../i18n/LanguageContext'

export function HomePage() {
  const { t } = useLanguage()

  return (
    <div>
      <section className="mx-auto max-w-4xl px-5 pt-16 pb-12 text-center">
        <ObangStripe className="mx-auto mb-6 h-3 w-48" />
        <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">{t('home_title')}</h1>
        <p className="mx-auto mt-4 max-w-xl text-obang-black/70">{t('home_subtitle')}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/recipes"
            className="inline-flex items-center border-2 border-obang-black bg-obang-red px-6 py-3 text-sm font-bold text-obang-white shadow-hard transition-[transform,box-shadow] duration-100 hover:bg-obang-red/90 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {t('home_cta')}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border-2 border-obang-black bg-obang-blue p-5">
            <h2 className="font-display font-bold text-obang-white">{t('feature1_title')}</h2>
            <p className="mt-1 text-sm text-obang-white/85">{t('feature1_desc')}</p>
          </div>
          <div className="border-2 border-obang-black bg-obang-black p-5">
            <h2 className="font-display font-bold text-obang-white">{t('feature2_title')}</h2>
            <p className="mt-1 text-sm text-obang-white/85">{t('feature2_desc')}</p>
          </div>
          <div className="border-2 border-obang-black bg-obang-yellow p-5">
            <h2 className="font-display font-bold text-obang-black">{t('feature3_title')}</h2>
            <p className="mt-1 text-sm text-obang-black/80">{t('feature3_desc')}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold">{t('home_popular')}</h2>
          <Link to="/recipes" className="text-sm font-medium text-obang-red hover:underline">
            {t('view_all')}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {recipes.slice(0, 4).map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold">{t('home_restaurants')}</h2>
          <Link to="/restaurants" className="text-sm font-medium text-obang-red hover:underline">
            {t('view_all')}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {restaurants.slice(0, 4).map((restaurant) => (
            <RestaurantCard key={restaurant.slug} restaurant={restaurant} />
          ))}
        </div>
      </section>
    </div>
  )
}
