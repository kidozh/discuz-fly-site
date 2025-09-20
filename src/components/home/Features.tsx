import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'

const Features: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section className="bg-theme-alt py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">{t('home_features_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm animate-fade-up">
            <h3 className="font-semibold mb-2">{t('home_feat_performance_title')}</h3>
            <p className="text-sm text-muted">{t('home_feat_performance_desc')}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm animate-fade-up delay-75">
            <h3 className="font-semibold mb-2">{t('home_feat_extensible_title')}</h3>
            <p className="text-sm text-muted">{t('home_feat_extensible_desc')}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm animate-fade-up delay-150">
            <h3 className="font-semibold mb-2">{t('home_feat_cross_title')}</h3>
            <p className="text-sm text-muted">{t('home_feat_cross_desc')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
