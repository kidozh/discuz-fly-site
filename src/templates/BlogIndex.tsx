import React, { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
const enTranslations = require('../locales/en/translation.json')
const zhTranslations = require('../locales/zh/translation.json')
import Layout from '../components/Layout'
import { Link, navigate } from 'gatsby'

const PAGE_SIZE = 5

const BlogIndex: React.FC<any> = ({ pageContext }) => {
  const rawPosts = pageContext?.posts || []

  // Normalize posts and parse dates
  const posts = useMemo(() => {
    return rawPosts.map((p: any) => {
      const fm = p.frontmatter || {}
      const title = fm.title || p.relativePath
      const slug = (fm.slug || p.relativePath || '').replace(/\.md$|\.markdown$/i, '').replace(/^\/+|\/+$/g, '')
      const date = fm.date ? new Date(fm.date) : null
      const excerpt = fm.excerpt || ''
      const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : []
      return { id: p.id || slug, title, slug, date, excerpt, tags }
    }).sort((a: any, b: any) => {
      // newest first; null dates go last
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return b.date.getTime() - a.date.getTime()
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

  // Support reading selectedTag from pageContext (tag pages) and from URL query
  const initialTag = pageContext?.selectedTag || null
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag)

  // page state synchronized with ?page=<n> and can be seeded from pageContext (SSR)
  const getPageFromUrl = () => {
    try {
      const qp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
      const p = parseInt(qp.get('page') || String(pageContext?.currentPage || '1'), 10)
      return Number.isFinite(p) && p > 0 ? p : 1
    } catch (e) { return Number(pageContext?.currentPage || 1) }
  }
  const [page, setPage] = useState(Number(pageContext?.currentPage || getPageFromUrl()))

  // keep URL in sync when page or tag changes
      useEffect(() => {
    try {
      const url = new URL(window.location.href)
      if (selectedTag) {
        url.pathname = `${langPrefix}/blog/tag/${String(selectedTag).toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`
      } else {
        url.pathname = `${langPrefix}/blog/`
      }
      if (page && page > 1) url.searchParams.set('page', String(page))
      else url.searchParams.delete('page')
      window.history.replaceState({}, '', url.toString())
    } catch (e) {}
  }, [selectedTag, page])

  const filtered = useMemo(() => {
    const f = selectedTag ? posts.filter((p: any) => p.tags.includes(selectedTag)) : posts
    return f
  }, [posts, selectedTag])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  function gotoPage(n: number) {
    const next = Math.max(1, Math.min(totalPages, n))
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fmtDate = (d: Date | null) => {
    if (!d) return null
    try {
      return new Intl.DateTimeFormat(i18n.language || 'en', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
    } catch (e) {
      return d.toISOString().slice(0,10)
    }
  }

  return (
    <Layout>
      <main className="max-w-4xl mx-auto py-12 px-4">
  <h1 className="text-3xl font-bold mb-6">{String(translate('blog.title') || 'Blog')}</h1>

        <div className="mb-6">
          <div className="flex items-center space-x-3 flex-wrap">
            <button
              onClick={() => { setSelectedTag(null); setPage(1) }}
              className={`px-3 py-1 rounded ${selectedTag === null ? 'bg-brand text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
              {String(translate('blog.all', { count: posts.length }))}
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => { setSelectedTag(t); setPage(1) }}
                className={`px-3 py-1 rounded ${selectedTag === t ? 'bg-brand text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

  <div className="mb-4 text-sm text-gray-600">{String(translate('blog.count', { count: filtered.length }))} — {String(translate('blog.page_of', { current, total: totalPages }))}</div>

        <ul className="space-y-6">
          {paged.map((p: any) => (
            <li
              key={p.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`${langPrefix}/blog/${p.slug}/`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(`${langPrefix}/blog/${p.slug}/`)
                }
              }}
              className="border rounded p-4 cursor-pointer transition-transform transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <h2 className="text-xl font-semibold mb-1">
                <Link to={`${langPrefix}/blog/${p.slug}/`} className="text-brand">{p.title}</Link>
              </h2>
              {p.date ? <div className="text-sm text-gray-500 mb-2">{fmtDate(p.date)}</div> : null}
              {p.excerpt ? <p className="text-sm text-gray-700 mb-2">{p.excerpt}</p> : null}
              {p.tags && p.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t: string) => (
                    <button
                      key={t}
                      onClick={(e) => { e.stopPropagation(); setSelectedTag(t); setPage(1) }}
                      className="text-sm px-2 py-1 bg-gray-100 rounded"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <button onClick={() => gotoPage(page - 1)} disabled={page <= 1} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">{String(translate('blog.previous') || 'Previous')}</button>
            <button onClick={() => gotoPage(page + 1)} disabled={page >= totalPages} className="ml-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">{String(translate('blog.next') || 'Next')}</button>
          </div>
          <div className="text-sm text-gray-600">{String(translate('blog.showing_range', { start: start + 1, end: Math.min(start + PAGE_SIZE, filtered.length), total: filtered.length }))}</div>
        </div>
      </main>
    </Layout>
  )
}

export default BlogIndex
