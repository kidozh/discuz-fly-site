import * as React from 'react'
import { graphql, type HeadFC } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'

const Dev404Page: React.FC = () => {
  const { t } = useTranslation()
  return (
    <main className="min-h-screen font-sans bg-theme text-theme transition-colors p-6">
      <h1 className="text-4xl font-semibold mb-16">{t('404_heading')}</h1>
      <p className="mb-12">{t('404_message')}</p>
    </main>
  )
}

export default Dev404Page

export const Head: HeadFC = () => {
  const { t } = useTranslation()
  return <title>{t('404_title')}</title>
}

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
