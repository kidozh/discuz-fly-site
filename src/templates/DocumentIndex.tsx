import React from 'react'
import { graphql, type HeadFC } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Layout from '../components/Layout'
import LocalizedLink from '../components/LocalizedLink'
import SeoHead from '../components/SeoHead'
import en from '../locales/en/translation.json'
import zh from '../locales/zh/translation.json'

const DocumentIndex = ({ data, pageContext, location }: any) => {
  const { t } = useTranslation()
  const language = pageContext.language
  const docs = data.allFile.nodes.flatMap(({ relativePath, childMarkdownRemark: markdown }: any) => {
    if (!markdown) return []
    const { frontmatter, excerpt } = markdown
    const fileLanguage = relativePath.match(/\.([a-z]{2})\.md$/i)?.[1]
    if ((frontmatter.language || fileLanguage || 'en') !== language) return []
    const slug = frontmatter.slug || relativePath.replace(/\.[a-z]{2}\.md$|\.md$/i, '').replace(/\/index$/i, '')
    return [{ slug, title: frontmatter.title || slug, excerpt: frontmatter.excerpt || excerpt, date: frontmatter.date }]
  }).sort((a: any, b: any) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0))

  return (
    <Layout pageProps={{ pageContext, location }}>
      <section className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
        <h1 className="mb-6 text-3xl font-bold">{t('docs.documents_title')}</h1>
        <ul className="grid gap-4 sm:grid-cols-2">
          {docs.map(({ slug, title, excerpt }: any) => (
            <li key={slug}>
              <LocalizedLink to={`/${pageContext.docPrefix}/${slug}/`} className="block h-full rounded-xl border border-slate-200 bg-theme-alt p-5 transition-colors hover:border-brand dark:border-slate-700 dark:hover:border-brand">
                <h2 className="mb-2 text-lg font-semibold text-brand">{title}</h2>
                <p className="text-sm leading-relaxed text-muted">{excerpt}</p>
              </LocalizedLink>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export const Head: HeadFC<unknown, { language: string }> = ({ pageContext, location }) => {
  const lang = pageContext.language
  return <SeoHead title={(lang === 'zh' ? zh : en)['docs.documents_title']} lang={lang} pathname={location.pathname} />
}

export const query = graphql`
  query DocumentIndexQuery($language: String!) {
    allFile(filter: { sourceInstanceName: { eq: "documents" }, extension: { in: ["md", "markdown"] } }) {
      nodes {
        relativePath
        childMarkdownRemark {
          frontmatter {
            title
            slug
            language
            date
            excerpt
          }
          excerpt(pruneLength: 140)
        }
      }
    }
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`

export default DocumentIndex
