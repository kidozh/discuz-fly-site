import * as React from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import { useTranslation } from 'gatsby-plugin-react-i18next'
const enTranslations = require('../locales/en/translation.json')
const zhTranslations = require('../locales/zh/translation.json')

type FooterProps = { pageProps?: any }

const Footer: React.FC<FooterProps> = ({ pageProps }) => {
  const { t, i18n } = useTranslation()
  const effectiveLang = pageProps?.pageContext?.i18n?.language || (i18n && i18n.language) || 'en'
  const raw = { en: enTranslations, zh: zhTranslations }
  const tFallback = (key: string, opts?: any) => {
    const v = raw[effectiveLang as 'en' | 'zh'] && raw[effectiveLang as 'en' | 'zh'][key]
    if (v && typeof v === 'string') {
      if (opts) {
        return Object.keys(opts).reduce((s, k) => s.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(opts[k])), v)
      }
      return v
    }
    return key
  }
  const translate = (key: string, opts?: any) => {
    try {
      if (i18n && i18n.language) {
        const res = t(key, { lng: effectiveLang, ...(opts || {}) })
        if (typeof res === 'string' && res !== key) return res
      }
    } catch (e) {}
    return tFallback(key, opts)
  }

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 mt-12 py-6 bg-theme text-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-3">
        <a href="/" aria-label="Home">
          <StaticImage src="../images/disfly-logo.svg" alt="disfly" className="w-6 h-6" placeholder="none" />
        </a>
        <div className="text-sm text-center muted">
          {translate('footer_text')}
        </div>
      </div>
    </footer>
  )
}

export default Footer
