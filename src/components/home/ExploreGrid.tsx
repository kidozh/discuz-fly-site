import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'

const ExploreGrid: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">{t('home_explore_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-theme-foreground animate-fade-up delay-75">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-md bg-brand/20 flex items-center justify-center text-brand font-bold">E</div>
                <div>
                  <h3 className="font-semibold">{t('home_explore_item_title', { num: i + 1 })}</h3>
                  <p className="text-sm text-muted">{t('home_explore_item_desc')}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExploreGrid
