import * as React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useStaticQuery, graphql } from 'gatsby'

type Props = {
  children: React.ReactNode
  className?: string
  // page props passed by Gatsby's wrapPageElement (optional)
  pageProps?: any
}

const Layout: React.FC<Props> = ({ children, pageProps, className = '' }) => {
  const data = useStaticQuery(graphql`
    query LayoutSiteMeta {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const siteTitle = data?.site?.siteMetadata?.title || ''

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Navbar pageProps={pageProps} />
      <main className="flex-1 bg-theme text-theme transition-colors">{children}</main>
      <Footer pageProps={pageProps} />
    </div>
  )
}

export default Layout
