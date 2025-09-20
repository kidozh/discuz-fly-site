import * as React from 'react'
import { graphql, type HeadFC, type PageProps } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Layout from '../components/Layout'
import SeoHead from '../components/SeoHead'

const AboutPage: React.FC<PageProps> = () => {
  const { t } = useTranslation()

  return (
    <Layout>
        <main className="min-h-screen font-sans bg-theme text-theme transition-colors">
      <div className="h-3" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-6">{t('about_title')}</h1>
        <p className="mb-4">{t('about_team_intro_single')}</p>
        <p className="mb-4">{t('about_github_label')}：</p>
        <p className="mb-6">
          <a href="https://github.com/kidozh/discuz_flutter" className="text-brand font-bold hover:underline" target="_blank" rel="noopener noreferrer">
            https://github.com/kidozh/discuz_flutter
          </a>
        </p>
        <h2 className="text-xl font-medium mb-3">{t('about_members_heading')}</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>{t('about_single_developer')}</li>
        </ul>
        <p className="text-sm text-muted">{t('contribute_prompt', 'If you would like to contribute, please open an issue or PR on the GitHub repository.')}</p>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-medium mb-3">{t('about_contact_title')}</h2>
          <p className="mb-1 text-sm text-gray-600">{t('about_contact_email_label')}: <a className="text-brand font-medium hover:underline" href="mailto:kidozh@gmail.com">kidozh@gmail.com</a></p>
        </div>
      </div>
    </main>
    </Layout>
    
  )
}

export default AboutPage

export const Head: HeadFC = () => {
  const { t } = useTranslation()
  return <SeoHead title={String(t('about_seo_title'))} description={String(t('about_seo_description'))} />
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
