import * as React from "react"
import { Link, HeadFC, PageProps, graphql } from "gatsby"
import SeoHead from '../components/SeoHead'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Navbar from '../components/Navbar'
import Layout from "../components/Layout"

const NotFoundPage: React.FC<PageProps> = () => {
  const { t } = useTranslation()
  return (
    <Layout>
      <main className="min-h-screen font-sans bg-theme text-theme transition-colors p-6">
      <h1 className="text-4xl font-semibold mb-16 max-w-xs">{t('404_heading')}</h1>
      <p className="mb-12">
        {t('404_message')}
        <br />
        {process.env.NODE_ENV === "development" ? (
          <>
            <br />
            <span>
              {t('404_dev_hint_prefix')} <code className="text-amber-700 bg-amber-100 px-1 rounded">src/pages/</code>
            </span>
            <br />
          </>
        ) : null}
        <br />
  <Link to="/" className="text-brand hover:underline">{t('404_go_home')}</Link>.
      </p>
    </main>
    </Layout>
    
  )
}

export default NotFoundPage

export const Head: HeadFC<PageProps> = (props) => {
  const ctx: any = props as any
  const pageI18n = ctx.pageContext?.i18n || {}
  const lang = pageI18n.language || 'en'
  // pageContext should have localized strings provided by plugin nodes; fallback to static
  const title = pageI18n?.title || 'Not Found'
  return <SeoHead title={title} lang={lang} />
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