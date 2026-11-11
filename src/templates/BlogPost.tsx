import React from 'react'
import { graphql, Link } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import LocalizedLink from '../components/LocalizedLink'
const enTranslations = require('../locales/en/translation.json')
const zhTranslations = require('../locales/zh/translation.json')
import Layout from '../components/Layout'
import SeoHead from '../components/SeoHead'

const BlogPost: React.FC<any> = (props) => {
  const { data, pageContext } = props
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
  const dateFormatter = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat(effectiveLang || 'en', { year: 'numeric', month: '2-digit', day: '2-digit' })
    } catch (e) { return null }
  }, [effectiveLang])

  if (dateSource) {
    try {
      const d = new Date(dateSource)
      date = dateFormatter ? dateFormatter.format(d) : String(dateSource)
    } catch (e) { date = String(dateSource) }
  }

  return (
    <Layout pageProps={props}>
      <SeoHead title={title} description={pageContext?.excerpt ? String(pageContext.excerpt) : undefined} />
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        {date ? <div className="text-sm text-gray-500 mb-6">{String(translate('blog.post_date_prefix') || '')} {date}</div> : null}
        <article className="prose lg:prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />

        {/* Prev / Next navigation styled like modern blog cards */}
        <div className="mt-12 border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pageContext?.previous ? (
              <Link
                to={pageContext.previous.path}
                className="group relative block rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:from-gray-950 dark:to-gray-900"
              >
                <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-brand/30" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-400 transition-colors group-hover:text-brand dark:border-gray-800 dark:bg-gray-950">
                    ◀
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-950">
                      {translate('blog.previous') || 'Previous'}
                    </div>
                    <div className="mt-3 text-lg font-semibold text-theme dark:text-theme">{pageContext.previous.title}</div>
                    {pageContext.previous.date ? <div className="text-sm text-gray-500 mt-1">{dateFormatter ? dateFormatter.format(new Date(pageContext.previous.date)) : String(pageContext.previous.date)}</div> : null}
                    {pageContext.previous.excerpt ? <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{pageContext.previous.excerpt}</div> : null}
                  </div>
                </div>
              </Link>
            ) : (<div />)}

            {pageContext?.next ? (
              <Link
                to={pageContext.next.path}
                className="group relative block rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:from-gray-950 dark:to-gray-900"
              >
                <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-brand/30" />
                <div className="relative flex items-start justify-end gap-4 text-right">
                  <div className="flex-1">
                    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-950">
                      {translate('blog.next') || 'Next'}
                    </div>
                    <div className="mt-3 text-lg font-semibold text-theme dark:text-theme">{pageContext.next.title}</div>
                    {pageContext.next.date ? <div className="text-sm text-gray-500 mt-1">{dateFormatter ? dateFormatter.format(new Date(pageContext.next.date)) : String(pageContext.next.date)}</div> : null}
                    {pageContext.next.excerpt ? <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{pageContext.next.excerpt}</div> : null}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-400 transition-colors group-hover:text-brand dark:border-gray-800 dark:bg-gray-950">
                    ▶
                  </div>
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
  query BlogPostById($id: String, $language: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        date
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

export default BlogPost
