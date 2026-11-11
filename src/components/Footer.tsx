import * as React from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import { Link as GLink } from 'gatsby-plugin-react-i18next'
const Link: any = GLink
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
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:px-8 lg:flex-row">
        <div className="flex items-center gap-3 text-sm text-muted">
          <Link to="/" aria-label={translate('nav_home')}>
            <StaticImage src="../images/disfly-logo.svg" alt="" className="w-6 h-6" placeholder="none" />
          </Link>
          <span>{translate('footer_text')}</span>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {[
            ['/doc/', 'nav_docs'],
            ['/doc/privacy_policy/', 'footer_privacy'],
            ['/doc/term_of_services/', 'footer_terms'],
          ].map(([path, label]) => (
            <li key={path}><Link to={path} className="hover:underline">{translate(label)}</Link></li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

export default Footer
