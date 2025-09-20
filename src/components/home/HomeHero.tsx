import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'

const HomeHero: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-up">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{t('home_hero_title')}</h1>
                <p className="text-lg text-muted mb-6">{t('home_hero_subtitle')}</p>

            <div className="flex items-center gap-3 mb-6">
                  <input
                    type="search"
                    placeholder={String(t('home_search_placeholder'))}
                    className="flex-1 min-w-0 px-4 py-3 rounded-md border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button className="px-4 py-3 rounded-md bg-brand text-white font-semibold">{String(t('home_search_button'))}</button>
            </div>

            <div className="flex flex-wrap gap-3">
                  <a className="inline-block px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">{t('home_get_started')}</a>
                  <a className="inline-block px-4 py-2 bg-transparent border border-gray-200 rounded-md hover:bg-gray-50">{t('home_docs')}</a>
            </div>
          </div>

          <div className="order-first lg:order-last">
            <div className="w-full rounded-lg shadow-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 p-6 text-white animate-fade-right">
              <div className="text-sm font-medium mb-2">Latest Release</div>
              <div className="text-2xl font-semibold mb-2">v1.2.0</div>
              <p className="text-sm text-slate-200">Improvements to extensions and performance.</p>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1 bg-white/10 rounded">Release Notes</button>
                <button className="px-3 py-1 bg-white/10 rounded">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
