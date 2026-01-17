import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby-plugin-react-i18next'
import { StaticImage } from 'gatsby-plugin-image'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'gatsby-plugin-react-i18next'
const enTranslations = require('../locales/en/translation.json')
const zhTranslations = require('../locales/zh/translation.json')

type NavbarProps = { pageProps?: any }

const Navbar: React.FC<NavbarProps> = ({ pageProps }) => {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState<boolean>(false)

  // Read theme from localStorage on client only
  useEffect(() => {
    try {
      const v = window.localStorage.getItem('theme')
      setDark(v === 'dark')
    } catch (e) {
      // ignore
    }
  }, [])
  const { t, i18n } = useTranslation()
  // Prefer page-scoped language from Gatsby pageContext during SSR/build.
  // Fall back to i18n.language when pageProps doesn't provide a language.
  const effectiveLang = pageProps?.pageContext?.i18n?.language || (i18n && i18n.language) || 'en'

  const raw = { en: enTranslations, zh: zhTranslations }
  const tFallback = (key: string) => {
    return (raw[effectiveLang as 'en' | 'zh'] && raw[effectiveLang as 'en' | 'zh'][key]) || key
  }
  const translate = (key: string) => {
    try {
      if (i18n && i18n.language) {
        const res = t(key, { lng: effectiveLang })
        // If i18n returned the key (no translation available), fall back to local JSON
        if (typeof res === 'string' && res !== key) return res
      }
    } catch (e) {}
    return tFallback(key)
  }

  // Wrapper to avoid strict Link prop typings causing TS errors in this file
  const NavLink: React.FC<any> = (props) => {
    return <Link {...props} />
  }

  // Determine current path for active link highlighting.
  const getCurrentPath = () => {
    const fromProps = pageProps?.location?.pathname
    if (fromProps) return fromProps
    if (typeof window !== 'undefined') return window.location.pathname
    return '/'
  }

  const normalizePath = (p: string) => {
    if (!p) return '/'
    // remove trailing slashes
    let s = p.replace(/\/+$|^\/+ /g, '/')
    // remove leading language segment like /en or /zh
    s = s.replace(/^\/[a-z]{2}(?=\/|$)/, '')
    // ensure starts with /
    if (!s.startsWith('/')) s = '/' + s
    // collapse multiple slashes
    s = s.replace(/\/+/g, '/')
    // remove trailing slash except root
    if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1)
    return s
  }

  const activePath = normalizePath(getCurrentPath())

  const navLinkClass = (to: string, base = 'text-theme dark:text-theme hover:text-brand transition-colors') => {
    const toNorm = normalizePath(to)
    const isActive = to === '/' ? activePath === '/' : activePath.startsWith(toNorm)
    const activeCls = isActive ? 'bg-brand text-white' : ''
    const paddingCls = 'px-3 py-2 rounded-md'
    // If active, remove hover classes so hover doesn't change color
    const effectiveBase = isActive ? base.replace(/hover:[^\s]+/g, '').replace(/dark:hover:[^\s]+/g, '') : base
    return `${paddingCls} ${activeCls} ${effectiveBase}`.trim()
  }

  // Removed debug logging to reduce build/runtime noise

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      try {
        window.localStorage.setItem('theme', 'dark')
      } catch (e) {}
    } else {
      root.classList.remove('dark')
      try {
        window.localStorage.setItem('theme', 'light')
      } catch (e) {}
    }
  }, [dark])

  return (
  <header className="bg-theme dark:bg-theme shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" placeholder="" className="flex items-center space-x-3">
              <StaticImage src="../images/disfly-logo.svg" alt="disfly" className="w-8 h-8" placeholder="none" />
              <span className="text-lg font-semibold text-theme dark:text-theme">{translate('title')}</span>
            </NavLink>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <nav className="flex space-x-4" aria-label="Main navigation">
              <NavLink to="/" placeholder="" className={navLinkClass('/')}>{translate('nav_home')}</NavLink>
              <NavLink to="/doc/" placeholder="" className={navLinkClass('/doc/')}>{translate('nav_docs')}</NavLink>
              <NavLink to={`/blog/`} placeholder="" className={navLinkClass(`/blog/`)}>{translate('blog.title')}</NavLink>
              <NavLink to="/about/" placeholder="" className={navLinkClass('/about/')}>{translate('nav_about')}</NavLink>
            </nav>
            <div className="ml-4 flex items-center space-x-4">
              <LanguageSwitcher pageProps={pageProps} />
              <button
                onClick={() => setDark((d) => !d)}
                className="p-2 rounded-md bg-theme dark:bg-theme text-theme dark:text-theme hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-pressed={dark}
                aria-label="Toggle dark mode"
              >
                {dark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md text-theme hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {open ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${open ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-theme dark:bg-theme transition-colors duration-200">
          <NavLink to="/" placeholder="" className={`${navLinkClass('/', 'text-base font-medium text-theme dark:text-theme hover:text-brand dark:hover:bg-gray-700')} block`}>{translate('nav_home')}</NavLink>
          <NavLink to="/doc/" placeholder="" className={`${navLinkClass('/doc/', 'text-base font-medium text-theme dark:text-theme hover:text-brand dark:hover:bg-gray-700')} block`}>{translate('nav_docs')}</NavLink>
          <NavLink to="/about/" placeholder="" className={`${navLinkClass('/about/', 'text-base font-medium text-theme dark:text-theme hover:text-brand dark:hover:bg-gray-700')} block`}>{translate('nav_about')}</NavLink>
          <div className="px-3 py-2">
            <LanguageSwitcher pageProps={pageProps} />
          </div>
          <div className="px-3 py-2">
            <button
              onClick={() => setDark((d) => !d)}
              className="p-2 rounded-md bg-theme dark:bg-theme text-theme dark:text-theme hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {dark ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
