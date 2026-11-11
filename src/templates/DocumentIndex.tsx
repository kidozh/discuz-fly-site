import React from 'react'
import { graphql, Link, type HeadFC, type PageProps } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Layout from '../components/Layout'
import DocSidebar, { groupDocuments, type DocumentEntry } from '../components/DocSidebar'
import SeoHead, { bilingualAlternates } from '../components/SeoHead'
import en from '../locales/en/translation.json'
import zh from '../locales/zh/translation.json'
import '../styles/editorial.css'

type DocumentIndexData = {
  allFile: {
    nodes: {
      relativePath: string
      childMarkdownRemark?: {
        excerpt?: string
        frontmatter: { title?: string; slug?: string; language?: string; excerpt?: string }
      }
    }[]
  }
}

type DocumentIndexContext = { language: string; docPrefix: string }

const DocumentIndex = ({ data, pageContext, location }: PageProps<DocumentIndexData, DocumentIndexContext>) => {
  const { t } = useTranslation()
  const indexPath = location.pathname.replace(/\/?$/, '/')
  const documents = data.allFile.nodes.flatMap(({ relativePath, childMarkdownRemark: markdown }): DocumentEntry[] => {
    if (!markdown) return []
    const { frontmatter, excerpt } = markdown
    const fileLanguage = relativePath.match(/\.([a-z]{2})\.md$/i)?.[1]
    if ((frontmatter.language || fileLanguage || 'en') !== pageContext.language) return []
    const slug = frontmatter.slug || relativePath.replace(/\.[a-z]{2}\.md$|\.md$/i, '').replace(/\/index$/i, '')
    return [{ slug, title: frontmatter.title || slug, excerpt: frontmatter.excerpt || excerpt, path: `${indexPath}${slug}/` }]
  })

  return (
    <Layout pageProps={{ pageContext, location }} className="editorial">
      <div className="editorial-shell docs-index-layout">
        <DocSidebar documents={documents} indexPath={indexPath} activePath={indexPath} />
        <div className="docs-index-content">
          <header className="docs-index-header">
            <h1>{t('docs.landing_title')}</h1>
            <p>{t('docs.seo_description')}</p>
          </header>
          <div className="docs-index-groups">
            {groupDocuments(documents).map(group => (
              <section key={group.id} aria-labelledby={`docs-${group.id}`}>
                <h2 id={`docs-${group.id}`}>{t(group.label)}</h2>
                <ul className="docs-entry-list">
                  {group.documents.map(doc => (
                    <li key={doc.path}>
                      <Link to={doc.path} className="docs-entry">
                        <div>
                          <h3>{doc.title}</h3>
                          {doc.excerpt && <p>{doc.excerpt}</p>}
                        </div>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const Head: HeadFC<unknown, DocumentIndexContext> = ({ pageContext, location }) => {
  const { language, docPrefix } = pageContext
  const copy = language === 'zh' ? zh : en
  return <SeoHead title={copy['docs.documents_title']} description={copy['docs.seo_description']} lang={language} pathname={location.pathname} alternates={bilingualAlternates(`/${docPrefix}/`)} />
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
