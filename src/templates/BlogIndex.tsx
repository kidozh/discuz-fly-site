import React, { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
const enTranslations = require('../locales/en/translation.json')
const zhTranslations = require('../locales/zh/translation.json')
import Layout from '../components/Layout'
import BlogCover, { foundationModelsSlug } from '../components/BlogCover'
import PublicationDate from '../components/PublicationDate'
import SeoHead, { bilingualAlternates } from '../components/SeoHead'
import { Link, navigate, graphql, type HeadFC } from 'gatsby'
import '../styles/editorial.css'

const PAGE_SIZE = 5

const BlogIndex: React.FC<any> = (props) => {
  const pageContext = props.pageContext || {}
  const rawPosts = pageContext?.posts || []

  // Normalize posts and parse dates
  const posts = useMemo(() => {
    return rawPosts.map((p: any) => {
      const fm = p.frontmatter || {}
      const title = fm.title || p.relativePath
      const slug = (fm.slug || p.relativePath || '').replace(/\.md$|\.markdown$/i, '').replace(/^\/+|\/+$/g, '')
      const date = typeof fm.date === 'string' ? fm.date : null
      const excerpt = fm.excerpt || ''
      const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : []
      const dateTs = date ? Date.parse(date) : null
      return { id: p.id || slug, title, slug, date, dateTs, excerpt, tags }
    }).sort((a: any, b: any) => {
      // newest first; null dates go last
      if (!a.dateTs && !b.dateTs) return 0
      if (!a.dateTs) return 1
      if (!b.dateTs) return -1
      return b.dateTs - a.dateTs
    })
  }, [rawPosts])

  const { t, i18n } = useTranslation()
  const effectiveLang = pageContext?.i18n?.language || (i18n && i18n.language) || 'en'
  const defaultLang = pageContext?.i18n?.defaultLanguage || 'en'
  const langPrefix = effectiveLang && effectiveLang !== defaultLang ? `/${effectiveLang}` : ''
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

  const allTags = useMemo(() => {
    const s = new Set<string>()
    posts.forEach((p: any) => p.tags.forEach((t: string) => s.add(t)))
    return Array.from(s).sort()
  }, [posts])

  const initialTag = pageContext.selectedTag || null
  const pathname = props.location.pathname as string
  const archivePath = pathname.replace(/^\/en(?=\/blog\/)/, '').replace(/\/page\/\d+\/?$/, '/')
  const [filter, setFilter] = useState<{ pathname: string; tag: string | null; page: number } | null>(null)
  const activeFilter = filter?.pathname === pathname ? filter : null
  const selectedTag = activeFilter ? activeFilter.tag : initialTag
  const routePage = Number(pageContext.currentPage || 1)
  const page = activeFilter?.page || routePage

  function selectTag(tag: string | null) {
    if (tag === initialTag) {
      setFilter(null)
      if (routePage > 1) navigate(archivePath)
    } else {
      setFilter({ pathname, tag, page: 1 })
    }
  }

  const filtered = useMemo(() => {
    const f = selectedTag ? posts.filter((p: any) => p.tags.includes(selectedTag)) : posts
    return f
  }, [posts, selectedTag])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  useEffect(() => {
    const legacyPage = Number(new URLSearchParams(props.location.search).get('page'))
    if (Number.isInteger(legacyPage) && legacyPage > 1 && legacyPage <= totalPages && legacyPage !== routePage) {
      navigate(`${archivePath}page/${legacyPage}/`, { replace: true })
    }
  }, [archivePath, props.location.search, routePage, totalPages])

  function paginationLink(number: number, label: string) {
    const className = 'blog-page-link'
    if (number < 1 || number > totalPages) {
      return <span className={className} aria-disabled="true">{label}</span>
    }
    if (activeFilter) {
      return (
        <button type="button" className={className} onClick={() => {
          setFilter({ ...activeFilter, page: number })
          window.scrollTo(0, 0)
        }}>
          {label}
        </button>
      )
    }
    return <Link to={number === 1 ? archivePath : `${archivePath}page/${number}/`} className={className}>{label}</Link>
  }

  const featured = current === 1 && !selectedTag ? paged[0] : undefined
  const articles = featured ? paged.slice(1) : paged
  const postPath = (slug: string) => `${langPrefix}/blog/${slug}/`

  return (
    <Layout pageProps={props} className="editorial editorial-blog">
      <div className="editorial-shell blog-index">
        <header className="blog-index-header">
          <div>
            <h1>{translate('blog.title')}</h1>
            <p>{translate('blog.seo_description')}</p>
          </div>
          <a className="blog-rss" href="/blog.xml" type="application/rss+xml">RSS <span aria-hidden="true">↗</span></a>
        </header>

        {allTags.length > 0 && (
          <div className="blog-filters">
            {[null, ...allTags].map(tag => (
              <button key={tag || 'all'} type="button" aria-pressed={selectedTag === tag} onClick={() => selectTag(tag)}>
                {tag || translate('blog.all', { count: posts.length })}
              </button>
            ))}
          </div>
        )}

        {featured && (
          <section aria-label={String(translate('blog.latest_article'))}>
            <Link to={postPath(featured.slug)} className="blog-feature">
              {featured.slug === foundationModelsSlug && <BlogCover />}
              <div className="blog-feature-copy" lang="zh">
                <p className="editorial-date"><PublicationDate date={featured.date} language={effectiveLang} /></p>
                <h2>{featured.title}</h2>
                {featured.excerpt && <p className="blog-feature-excerpt">{featured.excerpt}</p>}
                <span className="editorial-arrow" aria-hidden="true">→</span>
              </div>
            </Link>
          </section>
        )}

        <section className="blog-archive" aria-labelledby="blog-archive-title">
          <header className="blog-archive-header">
            <h2 id="blog-archive-title">{translate(featured ? 'blog.more_articles' : 'blog.archive')}</h2>
            <p>{translate('blog.count', { count: filtered.length })}</p>
          </header>
          <ul className="blog-card-grid">
            {articles.map((post: { id: string; slug: string; title: string; date?: string; excerpt?: string }) => (
              <li key={post.id}>
                <Link to={postPath(post.slug)} className="blog-card" lang="zh">
                  <p className="editorial-date"><PublicationDate date={post.date} language={effectiveLang} /></p>
                  <h3>{post.title}</h3>
                  {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
                  <span className="editorial-arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <nav className="blog-pagination" aria-label={String(translate('blog.pagination'))}>
          <div className="blog-page-controls">
            {paginationLink(current - 1, String(translate('blog.previous')))}
            {paginationLink(current + 1, String(translate('blog.next')))}
          </div>
          <p>{translate('blog.page_of', { current, total: totalPages })}</p>
        </nav>
      </div>
    </Layout>
  )
}

export default BlogIndex

export const Head: HeadFC<unknown, { i18n?: { language?: string }; selectedTag?: string; currentPage?: number }> = ({ pageContext, location }) => {
  const lang = pageContext.i18n?.language === 'zh' ? 'zh' : 'en'
  const copy = lang === 'zh' ? zhTranslations : enTranslations
  const basePath = location.pathname.replace(/^\/(?:en|zh)(?=\/blog\/)/, '')
  const alternates = bilingualAlternates(basePath)
  const parts = [pageContext.selectedTag, copy['blog.title']]
  if (pageContext.currentPage && pageContext.currentPage > 1) {
    parts.push(copy['blog.seo_page'].replace('{{page}}', String(pageContext.currentPage)))
  }
  return <SeoHead title={parts.filter(Boolean).join(' · ')} description={copy['blog.seo_description']} lang={lang} pathname={alternates[lang]} alternates={alternates} />
}

export const query = graphql`
  query BlogIndexLocales($language: String!) {
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
