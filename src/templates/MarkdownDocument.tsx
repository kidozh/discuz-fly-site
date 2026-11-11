import React from 'react'
import { graphql, Link, type HeadFC, type PageProps } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Layout from '../components/Layout'
import SeoHead from '../components/SeoHead'
import DocSidebar, { type DocumentEntry } from '../components/DocSidebar'
import PublicationDate from '../components/PublicationDate'
import '../styles/editorial.css'

type Heading = { id: string; value: string; depth: number }
type DocumentData = {
  markdownRemark?: {
    html: string
    excerpt: string
    headings: (Omit<Heading, 'id'> & { id: string | null })[]
    frontmatter?: { title?: string; date?: string; excerpt?: string }
  }
}

type DocumentContext = {
  title?: string
  language: string
  docPrefix: string
  docPages: (DocumentEntry & { language: string })[]
  i18n?: { defaultLanguage?: string }
  alternates?: Record<string, string>
}

function SectionLinks({ headings }: { headings: Heading[] }) {
  const firstLevel = Math.min(...headings.map(heading => heading.depth))
  return (
    <ul className="docs-section-links">
      {headings.filter(heading => heading.depth <= firstLevel + 1).map(heading => (
        <li key={heading.id} className={heading.depth > firstLevel ? 'docs-section-child' : undefined}>
          <a href={`#${encodeURIComponent(heading.id)}`}>{heading.value}</a>
        </li>
      ))}
    </ul>
  )
}

const MarkdownDocument = (props: PageProps<DocumentData, DocumentContext>) => {
  const { data, pageContext, location } = props
  const { t } = useTranslation()
  const { language, docPrefix, docPages, i18n } = pageContext
  const doc = data.markdownRemark
  const title = pageContext.title || doc?.frontmatter?.title || t('docs.documentation')
  const docsPrefix = language === (i18n?.defaultLanguage || 'en') ? '' : `/${language}`
  const indexPath = `${docsPrefix}/${docPrefix}/`
  const documents = docPages.filter(page => page.language === language)
  const headings = doc?.headings.filter((heading): heading is Heading => Boolean(heading.id)) || []
  const updated = doc?.frontmatter?.date
  const html = doc?.html || ''

  return (
    <Layout pageProps={props} className="editorial">
      <div className="editorial-shell docs-reading-layout">
        <DocSidebar documents={documents} indexPath={indexPath} activePath={location.pathname} mobile />
        <header className="docs-article-header">
          <Link to={indexPath} className="editorial-back"><span aria-hidden="true">←</span>{t('docs.documentation')}</Link>
          <h1>{title}</h1>
          {updated && !Number.isNaN(Date.parse(updated)) && (
            <p className="editorial-date"><span>{t('docs.updated')}</span> <PublicationDate date={updated} language={language} /></p>
          )}
        </header>
        {headings.length > 0 && (
          <aside className="docs-toc">
            <nav className="docs-sticky docs-desktop docs-toc-nav" aria-label={String(t('docs.on_this_page'))}>
              <p>{t('docs.on_this_page')}</p>
              <SectionLinks headings={headings} />
            </nav>
            <details className="docs-disclosure docs-mobile">
              <summary>{t('docs.on_this_page')}</summary>
              <SectionLinks headings={headings} />
            </details>
          </aside>
        )}
        <article className="docs-article editorial-prose prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Layout>
  )
}

export default MarkdownDocument

export const Head: HeadFC<DocumentData, DocumentContext> = ({ data, pageContext, location }) => (
  <SeoHead
    title={pageContext.title}
    description={data.markdownRemark?.frontmatter?.excerpt || data.markdownRemark?.excerpt}
    lang={pageContext.language}
    pathname={location.pathname}
    alternates={pageContext.alternates}
  />
)

export const query = graphql`
  query MarkdownDocumentQuery($id: String!, $language: String!) {
    markdownRemark(id: { eq: $id }) {
      excerpt(pruneLength: 155)
      html
      headings {
        id
        value
        depth
      }
      frontmatter {
        title
        date
        excerpt
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
