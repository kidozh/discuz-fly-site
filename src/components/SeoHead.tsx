import * as React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

type Props = {
  title?: string
  description?: string
  lang: string
  pathname?: string
  alternates?: Record<string, string>
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function bilingualAlternates(pathname: string) {
  return { en: pathname, zh: `/zh${pathname}`, 'x-default': pathname }
}

const SeoHead: React.FC<Props> = ({ title, description, lang, pathname, alternates, type = 'website', noIndex }) => {
  const { site: { siteMetadata } } = useStaticQuery(graphql`
    query SiteMetaForHead {
      site {
        siteMetadata {
          title
          siteUrl
        }
      }
    }
  `)
  const isChinese = lang.startsWith('zh')
  const siteName = isChinese ? '谈坛' : siteMetadata.title
  const fullTitle = !title ? siteName : title.includes(siteName) ? title : `${title} | ${siteName}`
  const canonical = pathname && new URL(pathname, siteMetadata.siteUrl).href
  const image = new URL('/icons/icon-512x512.png', siteMetadata.siteUrl).href
  const summary = description?.trim()

  return (
    <>
      <html lang={lang} />
      <title>{fullTitle}</title>
      {summary && <meta name="description" content={summary} />}
      {noIndex && <meta name="robots" content="noindex, follow" />}
      {canonical && <link rel="canonical" href={canonical} />}
      {alternates && Object.entries(alternates).map(([language, path]) => (
        <link key={language} rel="alternate" hrefLang={language} href={new URL(path, siteMetadata.siteUrl).href} />
      ))}
      <meta property="og:title" content={fullTitle} />
      {summary && <meta property="og:description" content={summary} />}
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={isChinese ? 'zh_CN' : 'en_US'} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={siteName} />
      <meta name="twitter:card" content="summary" />
    </>
  )
}

export default SeoHead
