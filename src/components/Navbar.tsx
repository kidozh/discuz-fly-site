import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby-plugin-react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'gatsby-plugin-react-i18next'

const Navbar: React.FC = () => {
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
  const { t } = useTranslation()

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
            <Link to="/" placeholder="" className="flex items-center space-x-3">
              <span className="inline-block w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'rgb(var(--brand))' }}>D</span>
              <span className="text-lg font-semibold text-theme dark:text-theme">DiscuzFlySite</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <nav className="flex space-x-4" aria-label="Main navigation">
              <Link to="/" placeholder="" className="text-theme dark:text-theme hover:text-brand transition-colors">{t('nav_home')}</Link>
              <Link to="/docs/" placeholder="" className="text-theme dark:text-theme hover:text-brand transition-colors">{t('nav_docs')}</Link>
              <Link to="/about/" placeholder="" className="text-theme dark:text-theme hover:text-brand transition-colors">{t('nav_about')}</Link>
            </nav>
            <div className="ml-4 flex items-center space-x-4">
              <LanguageSwitcher />
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
          <Link to="/" placeholder="" className="block px-3 py-2 rounded-md text-base font-medium text-theme dark:text-theme hover:text-brand dark:hover:bg-gray-700">{t('nav_home')}</Link>
          <Link to="/docs/" placeholder="" className="block px-3 py-2 rounded-md text-base font-medium text-theme dark:text-theme hover:text-brand dark:hover:bg-gray-700">{t('nav_docs')}</Link>
          <Link to="/about/" placeholder="" className="block px-3 py-2 rounded-md text-base font-medium text-theme dark:text-theme hover:text-brand dark:hover:bg-gray-700">{t('nav_about')}</Link>
          <div className="px-3 py-2">
            <LanguageSwitcher />
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
