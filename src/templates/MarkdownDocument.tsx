import React, { useEffect } from 'react'
import { graphql, type HeadFC } from 'gatsby'
import Layout from '../components/Layout'
import SeoHead from '../components/SeoHead'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import DocSidebar from '../components/DocSidebar'
import LocalizedLink from '../components/LocalizedLink'

type Props = {
  data: any
  pageContext: any
  location?: any
}

const MarkdownDocument: React.FC<Props> = ({ data, pageContext, location }) => {
  // graphql query for the markdown node can fail if transformer isn't present
  // so we accept html/title passed through pageContext when available.
  const html = pageContext && pageContext.html ? pageContext.html : (data && data.markdownRemark && data.markdownRemark.html);
  // compute title with fallbacks: frontmatter -> pageContext.title -> first H1 from html -> filename
  const fmTitle = data && data.markdownRemark && data.markdownRemark.frontmatter && data.markdownRemark.frontmatter.title
  let title = pageContext && pageContext.title ? pageContext.title : fmTitle
  if (!title && html) {
    // extract first H1 from rendered HTML
    try {
      const m = html.match(/<h1[^>]*>(.*?)<\/h1>/i)
      if (m && m[1]) {
        title = m[1].replace(/<[^>]+>/g, '').trim()
      }
    } catch (e) {}
  }
  if (!title && pageContext?.slug) {
    const parts = String(pageContext.slug).split('/').filter(Boolean)
    title = parts.length ? parts[parts.length - 1] : pageContext.slug
  }
  // pageContext.language will be set by createPages
  // Ensure i18n is initialized and set to the page language on the client.
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const langFromContext = pageContext?.i18n?.language || pageContext?.language;
    if (langFromContext && i18n && i18n.language !== langFromContext) {
      try { i18n.changeLanguage(langFromContext); } catch (e) {}
    }
  }, [pageContext?.i18n?.language, pageContext?.language, i18n]);
  // Build sidebar nodes from pageContext.docPages (written by gatsby-node)
  const nodes = React.useMemo(() => {
    const list = pageContext?.docPages || []
    const lang = pageContext?.i18n?.language || pageContext?.language || 'en'
    return list.filter((p: any) => String(p.language) === String(lang)).map((p: any) => ({ id: p.id, path: p.path, title: p.title || p.id, date: p.date || null }))
  }, [pageContext])

  const activePath = (location && location.pathname) || pageContext?.i18n?.originalPath || pageContext?.path || pageContext?.slug

  return (
    <Layout pageProps={{ pageContext, location }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto py-12 px-4">
        <aside className="hidden md:block">
          <DocSidebar nodes={nodes} language={pageContext?.i18n?.language || pageContext?.language} docPrefix={pageContext?.docPrefix || 'doc'} activePath={activePath} showBack />
        </aside>
        <div className="min-w-0 md:col-span-3">
          <LocalizedLink to={`/${pageContext?.docPrefix || 'doc'}/`} className="mb-5 inline-flex text-sm font-semibold text-brand hover:underline md:hidden">
            ← {t('docs.back')}
          </LocalizedLink>
          {title ? <h1 className="text-2xl font-bold mb-6">{title}</h1> : null}
          <article className="prose max-w-none break-words prose-table:my-3 prose-td:align-top dark:prose-invert lg:prose-lg" dangerouslySetInnerHTML={{ __html: html || '' }} />
        </div>
      </div>
    </Layout>
  )
}



export default MarkdownDocument

type DocumentHeadData = {
  markdownRemark?: { excerpt: string; frontmatter?: { excerpt?: string } }
}

type DocumentHeadContext = {
  title?: string
  language: string
  alternates?: Record<string, string>
}

export const Head: HeadFC<DocumentHeadData, DocumentHeadContext> = ({ data, pageContext, location }) => (
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
      frontmatter {
        title
        slug
        language
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
