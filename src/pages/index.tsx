import * as React from "react"
import { graphql, type HeadFC, type PageProps } from "gatsby"
import { useTranslation } from 'gatsby-plugin-react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Navbar from '../components/Navbar'

// Using Tailwind + theme utilities for layout and colors

const docLinks = [
  {
    text: "TypeScript Documentation",
    url: "https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/",
  color: "#0D96F2",
  },
  {
    text: "GraphQL Typegen Documentation",
    url: "https://www.gatsbyjs.com/docs/how-to/local-development/graphql-typegen/",
  color: "#0D96F2",
  }
]

const badgeStyle = {
  color: "#fff",
  backgroundColor: "#088413",
  border: "1px solid #088413",
  fontSize: 11,
  fontWeight: "bold",
  letterSpacing: 1,
  borderRadius: 4,
  padding: "4px 6px",
  display: "inline-block",
  position: "relative" as "relative",
  top: -2,
  marginLeft: 10,
  lineHeight: 1,
}

const links = [
  {
    text: "Tutorial",
    url: "https://www.gatsbyjs.com/docs/tutorial/getting-started/",
    description:
      "A great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
    color: "#E95800",
  },
  {
    text: "How to Guides",
    url: "https://www.gatsbyjs.com/docs/how-to/",
    description:
      "Practical step-by-step guides to help you achieve a specific goal. Most useful when you're trying to get something done.",
    color: "#1099A8",
  },
  {
    text: "Reference Guides",
    url: "https://www.gatsbyjs.com/docs/reference/",
    description:
      "Nitty-gritty technical descriptions of how Gatsby works. Most useful when you need detailed information about Gatsby's APIs.",
  color: "#0D6BFF",
  },
  {
    text: "Conceptual Guides",
    url: "https://www.gatsbyjs.com/docs/conceptual/",
    description:
      "Big-picture explanations of higher-level Gatsby concepts. Most useful for building understanding of a particular topic.",
    color: "#0D96F2",
  },
  {
    text: "Plugin Library",
    url: "https://www.gatsbyjs.com/plugins",
    description:
      "Add functionality and customize your Gatsby site or app with thousands of plugins built by our amazing developer community.",
    color: "#8EB814",
  },
  {
    text: "Build and Host",
    url: "https://www.gatsbyjs.com/cloud",
    badge: true,
    description:
      "Now you’re ready to show the world! Give your Gatsby site superpowers: Build and host on Gatsby Cloud. Get started for free!",
  color: "#0D6BFF",
  },
]

const IndexPage: React.FC<PageProps> = () => {
  // const { t } = useTranslation()
  const { t } = useTranslation()

  return (
    <main className="min-h-screen font-sans bg-theme text-theme transition-colors">
      <div className="h-3" />
  <h1 className="text-4xl font-semibold mb-16 max-w-xs">{t('title')}</h1>
  <p className="mb-12">{t('welcome')}</p>

      <ul className="mb-12 pl-0">
        {docLinks.map(doc => (
          <li key={doc.url} className="list-none inline-block mb-6 mr-3">
            <a
              className="text-brand font-bold text-base align-text-bottom transition-colors"
              href={`${doc.url}?utm_source=starter&utm_medium=ts-docs&utm_campaign=minimal-starter-ts`}
            >
              {doc.text}
            </a>
          </li>
        ))}
      </ul>

      <ul className="mb-24 pl-0">
        {links.map(link => (
          <li key={link.url} className="font-light text-xl max-w-xl mb-8" style={{ color: link.color }}>
            <span>
              <a
                className="text-brand font-bold text-base transition-colors"
                href={`${link.url}?utm_source=starter&utm_medium=start-page&utm_campaign=minimal-starter-ts`}
              >
                {link.text}
              </a>
              {link.badge && (
                <span className="inline-block bg-green-700 text-white text-xs font-bold rounded px-2 py-0.5 ml-2" aria-label="New Badge">
                  NEW!
                </span>
              )}
              <p className="text-sm mt-2 mb-0">{link.description}</p>
            </span>
          </li>
        ))}
      </ul>

      <img
        alt="Gatsby G Logo"
        src="data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2a10 10 0 110 20 10 10 0 010-20zm0 2c-3.73 0-6.86 2.55-7.75 6L14 19.75c3.45-.89 6-4.02 6-7.75h-5.25v1.5h3.45a6.37 6.37 0 01-3.89 4.44L6.06 9.69C7 7.31 9.3 5.63 12 5.63c2.13 0 4 1.04 5.18 2.65l1.23-1.06A7.959 7.959 0 0012 4zm-8 8a8 8 0 008 8c.04 0 .09 0-8-8z' fill='%23639'/%3E%3C/svg%3E"
      />

    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>

export const query = graphql`
  query($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
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
