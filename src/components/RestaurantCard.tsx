import type { Restaurant } from '../data/restaurants'
import { useLanguage } from '../i18n/LanguageContext'

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { lang, t } = useLanguage()
  const region = lang === 'en' ? restaurant.regionEn : restaurant.region
  const note = lang === 'en' ? restaurant.noteEn : restaurant.note
  const name = lang === 'en' ? restaurant.nameEn : restaurant.name

  return (
    <div className="block border-2 border-obang-black bg-obang-white p-5 shadow-hard">
      <div className="text-xs font-medium text-obang-black/70">{region}</div>
      <h3 className="mt-2 font-display text-lg font-bold">
        {name}
        {lang !== 'en' && restaurant.nameEn !== restaurant.name && (
          <span className="ml-2 text-sm font-normal text-obang-black/70">({restaurant.nameEn})</span>
        )}
      </h3>
      {note && note !== '-' && <p className="mt-1 text-sm text-obang-black/70">{note}</p>}

      <div className="mt-3 space-y-1 text-sm text-obang-black/80">
        {restaurant.address && (
          <div>
            <span className="font-medium">{t('address_label')}:</span> {restaurant.address}
          </div>
        )}
        {restaurant.phone && (
          <div>
            <span className="font-medium">{t('phone_label')}:</span> {restaurant.phone}
          </div>
        )}
        {restaurant.rating != null && restaurant.reviewCount != null && (
          <div>{t('rating_reviews')(restaurant.rating, restaurant.reviewCount)}</div>
        )}
      </div>
    </div>
  )
}
