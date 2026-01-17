import React, { useMemo, useState } from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
const enTranslations = require('../locales/en/translation.json')
const zhTranslations = require('../locales/zh/translation.json')
import Layout from '../components/Layout'
import { Link } from 'gatsby'

const TagsIndex: React.FC<any> = (props) => {
  const { pageContext } = props
  const { t, i18n } = useTranslation()
  const effectiveLang = pageContext?.i18n?.language || (i18n && i18n.language) || 'en'
  const defaultLang = pageContext?.i18n?.defaultLanguage || 'en'
  const langPrefix = effectiveLang && effectiveLang !== defaultLang ? `/${effectiveLang}` : ''
  const raw = { en: enTranslations, zh: zhTranslations }
  const tFallback = (key: string, opts?: any) => {
    const v = raw[effectiveLang as 'en' | 'zh'] && raw[effectiveLang as 'en' | 'zh'][key]
    if (v && typeof v === 'string') return v
    return key
  }
  const translate = (key: string) => {
    try {
      if (i18n && i18n.language) {
        const res = t(key, { lng: effectiveLang })
        if (typeof res === 'string' && res !== key) return res
      }
    } catch (e) {}
    return tFallback(key)
  }

  const tagsData: Array<{ tag: string; count: number }> = pageContext?.tags || []
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'count'|'alpha'>('count')

  const filtered = useMemo(() => {
    const q = String(query || '').trim().toLowerCase()
    return tagsData.filter((t) => t.tag.toLowerCase().includes(q)).sort((a, b) => {
      if (sortBy === 'count') return b.count - a.count || a.tag.localeCompare(b.tag)
      return a.tag.localeCompare(b.tag)
    })
  }, [tagsData, query, sortBy])

  return (
    <Layout pageProps={props}>
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">{String(translate('blog.title') || 'Blog')} — Tags</h1>
        <div className="mb-4 flex items-center gap-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={String(translate('blog.search_placeholder') || 'Search tags')} className="flex-1 px-3 py-2 border rounded" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-2 py-2 border rounded">
            <option value="count">Sort by count</option>
            <option value="alpha">Sort by name</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(({ tag, count }) => {
            const slug = String(tag).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            return (
              <Link key={tag} to={`${langPrefix}/blog/tag/${slug}/`} className="flex justify-between items-center p-4 border rounded hover:shadow-md transition">
                <span>{tag}</span>
                <span className="text-sm text-gray-500">{count}</span>
              </Link>
            )
          })}
        </div>
      </main>
    </Layout>
  )
}

export default TagsIndex
