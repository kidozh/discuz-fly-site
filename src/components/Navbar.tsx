import React, { useState, useEffect } from 'react'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import { StaticImage } from 'gatsby-plugin-image'
import LanguageSwitcher from './LanguageSwitcher'
const enTranslations = require('../locales/en/translation.json')
const zhTranslations = require('../locales/zh/translation.json')

type NavbarProps = { pageProps?: any }

type NavLinkProps = Pick<React.ComponentProps<typeof Link>, 'to' | 'className' | 'aria-current' | 'children'>
// The i18next declaration marks unused DOM props as required.
const NavLink = Link as unknown as React.ComponentType<NavLinkProps>

const navigation = [
  { to: '/', label: 'nav_home' },
  { to: '/doc/', label: 'nav_docs' },
  { to: '/blog/', label: 'blog.title' },
  { to: '/about/', label: 'nav_about' },
]

const Navbar: React.FC<NavbarProps> = ({ pageProps }) => {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState<boolean>(false)

  useEffect(() => {
    const root = document.documentElement
    const colorScheme = window.matchMedia?.('(prefers-color-scheme: dark)')
    setDark(root.classList.contains('dark'))

    const followSystem = (event: MediaQueryListEvent) => {
      if (root.dataset.themePreference !== 'system') return
      root.classList.toggle('dark', event.matches)
      setDark(event.matches)
    }

    colorScheme?.addEventListener?.('change', followSystem)
    return () => colorScheme?.removeEventListener?.('change', followSystem)
  }, [])

  function toggleTheme() {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    const preference = isDark ? 'dark' : 'light'
    root.dataset.themePreference = preference
    setDark(isDark)
    try {
      window.localStorage.setItem('theme', preference)
    } catch {}
  }

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

  const pathname = pageProps?.location?.pathname || (typeof window !== 'undefined' ? window.location.pathname : '/')
  const activePath = pathname.replace(/^\/(?:en|zh)(?=\/|$)/, '').replace(/\/+$/, '') + '/'
  const navigationLinks = navigation.map(({ to, label }) => {
    const currentPage = activePath === to
    const currentSection = to !== '/' && activePath.startsWith(to)

    return (
      <NavLink
        key={to}
        to={to}
        className="site-nav-link"
        aria-current={currentPage ? 'page' : currentSection ? 'location' : undefined}
      >
        {translate(label)}
      </NavLink>
    )
  })

  return (
    <header className="site-toolbar bg-theme dark:bg-theme shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-3">
              <StaticImage src="../images/disfly-logo.svg" alt="disfly" className="w-8 h-8" placeholder="none" />
              <span className="text-lg font-semibold text-theme dark:text-theme">{translate('title')}</span>
            </NavLink>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <nav className="flex space-x-4" aria-label="Main navigation">
              {navigationLinks}
            </nav>
            <div className="ml-4 flex items-center space-x-4">
              <LanguageSwitcher pageProps={pageProps} />
              <button
                type="button"
                onClick={toggleTheme}
                className="site-toolbar-button p-2"
                aria-pressed={dark}
                aria-label={translate('theme_toggle')}
              >
                <svg aria-hidden="true" className="hidden w-5 h-5 dark:block" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
                </svg>
                <svg aria-hidden="true" className="w-5 h-5 dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="site-toolbar-button inline-flex items-center justify-center p-2"
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
          <nav className="space-y-1" aria-label="Main navigation">
            {navigationLinks}
          </nav>
          <div className="px-3 py-2">
            <LanguageSwitcher pageProps={pageProps} />
          </div>
          <div className="px-3 py-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={dark}
              aria-label={translate('theme_toggle')}
              className="site-toolbar-button p-2"
            >
              <span className="dark:hidden">{translate('theme_switch_to_dark')}</span>
              <span className="hidden dark:inline">{translate('theme_switch_to_light')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
