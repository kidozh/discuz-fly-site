import * as React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'

const Footer: React.FC = () => {
  const { t } = useTranslation()
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 mt-12 py-6 bg-theme text-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-center muted">
        {t ? t('footer_text') : '© 2025'}
      </div>
    </footer>
  )
}

export default Footer
