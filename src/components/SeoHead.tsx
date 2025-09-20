import * as React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

type Props = {
  title?: string
  description?: string
  lang?: string
  pathname?: string
}

const SeoHead: React.FC<Props> = ({ title, description = '', lang = 'en', pathname }) => {
  const data = useStaticQuery(graphql`
    query SiteMetaForHead {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const siteTitle = data?.site?.siteMetadata?.title || ''
  const siteUrl = process.env.SITE_URL || ''
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  let url = ''
  try {
    if (pathname) {
      if (siteUrl) {
        url = new URL(pathname, siteUrl).href
      } else {
        // fallback to using pathname as-is when no siteUrl is configured
        url = pathname
      }
    } else {
      url = siteUrl || ''
    }
  } catch (e) {
    url = pathname || siteUrl || ''
  }

  return (
    <>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
    </>
  )
}

export default SeoHead
