import React from 'react'
import { graphql, Link } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import LocalizedLink from '../components/LocalizedLink'
const enTranslations = require('../locales/en/translation.json')
const zhTranslations = require('../locales/zh/translation.json')
import Layout from '../components/Layout'
import SeoHead from '../components/SeoHead'

const BlogPost: React.FC<any> = ({ data, pageContext }) => {
  const { t, i18n } = useTranslation()
  const effectiveLang = pageContext?.i18n?.language || (i18n && i18n.language) || 'en'
  const raw = { en: enTranslations, zh: zhTranslations }
  const tFallback = (key: string, opts?: any) => {
    const v = raw[effectiveLang as 'en' | 'zh'] && raw[effectiveLang as 'en' | 'zh'][key]
    if (v && typeof v === 'string') {
      if (opts) {
        return Object.keys(opts).reduce((s, k) => s.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(opts[k])), v)
      }
      return v
    }
    return key
  }
  const translate = (key: string, opts?: any) => {
    try {
      if (i18n && i18n.language) {
        const res = t(key, { lng: effectiveLang, ...(opts || {}) })
        if (typeof res === 'string' && res !== key) return res
      }
    } catch (e) {}
    return tFallback(key, opts)
  }

  const md = data && data.markdownRemark
  const title = pageContext?.title || (md && md.frontmatter && md.frontmatter.title) || String(translate('blog.post_default_title') || 'Blog Post')
  const html = pageContext?.html || (md && md.html) || ''
  let date: string | null = null
  const dateSource = pageContext?.date || (md && md.frontmatter && md.frontmatter.date)
  if (dateSource) {
    try {
      const d = new Date(dateSource)
      date = new Intl.DateTimeFormat(effectiveLang || 'en', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
    } catch (e) { date = String(dateSource) }
  }

  return (
    <Layout>
      <SeoHead title={title} description={pageContext?.excerpt ? String(pageContext.excerpt) : undefined} />
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        {date ? <div className="text-sm text-gray-500 mb-6">{String(translate('blog.post_date_prefix') || '')} {date}</div> : null}
        <article className="prose lg:prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />

        {/* Prev / Next navigation styled like modern blog cards */}
        <div className="mt-12 border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pageContext?.previous ? (
              <Link to={pageContext.previous.path} className="group block p-5 rounded-lg border bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start">
                  <div className="mr-4 text-3xl text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200">◀</div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{translate('blog.previous') || 'Previous'}</div>
                    <div className="font-semibold text-lg text-theme dark:text-theme">{pageContext.previous.title}</div>
                    {pageContext.previous.date ? <div className="text-sm text-gray-400 mt-1">{new Date(pageContext.previous.date).toLocaleDateString(effectiveLang)}</div> : null}
                    {pageContext.previous.excerpt ? <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{pageContext.previous.excerpt}</div> : null}
                  </div>
                </div>
              </Link>
            ) : (<div />)}

            {pageContext?.next ? (
              <Link to={pageContext.next.path} className="group block p-5 rounded-lg border bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-end text-right">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{translate('blog.next') || 'Next'}</div>
                    <div className="font-semibold text-lg text-theme dark:text-theme">{pageContext.next.title}</div>
                    {pageContext.next.date ? <div className="text-sm text-gray-400 mt-1">{new Date(pageContext.next.date).toLocaleDateString(effectiveLang)}</div> : null}
                    {pageContext.next.excerpt ? <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{pageContext.next.excerpt}</div> : null}
                  </div>
                  <div className="ml-4 text-3xl text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200">▶</div>
                </div>
              </Link>
            ) : (<div />)}
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query BlogPostById($id: String) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        date
      }
    }
  }
`

export default BlogPost
