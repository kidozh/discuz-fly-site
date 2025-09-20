import * as React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'

const logos = [
  '/icons/icon-192x192.png',
  '/icons/icon-192x192.png',
  '/icons/icon-192x192.png',
  '/icons/icon-192x192.png',
]

const CtaTrust: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white relative-blobs">
      <div className="absolute -left-24 -top-20 pointer-events-none">
        <span aria-hidden="true" className="bg-blob blob-1" />
      </div>
      <div className="absolute right-8 top-16 pointer-events-none">
        <span aria-hidden="true" className="bg-blob blob-2" />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{t('home_cta_title')}</h2>
          <p className="text-lg text-slate-200 mb-8">{t('home_cta_subtitle')}</p>

          <div className="flex items-center justify-center gap-4">
            <a href="https://play.google.com/store/apps/details?id=com.kidozh.discuz_flutter" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-white text-black font-semibold shadow-lg hover:opacity-95 transition" aria-label={String(t('home_download_play'))}>
              {t('home_download_play')}
            </a>
            <a href="https://apps.apple.com/us/app/%E8%B0%88%E5%9D%9B/id1601703772" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border border-white/30 text-white font-medium hover:bg-white/5 transition" aria-label={String(t('home_download_appstore'))}>
              {t('home_download_appstore')}
            </a>
          </div>
        </div>

        <div className="mt-12">
          <div className="text-center text-sm text-slate-400 mb-4">{t('home_trusted_by')}</div>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {logos.map((src, i) => (
              <img key={i} src={src} alt={`logo-${i}`} className="h-10 opacity-80" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaTrust
