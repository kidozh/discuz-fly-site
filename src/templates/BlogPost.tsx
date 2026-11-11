import React from 'react'
import { graphql, Link, type HeadFC, type PageProps } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Layout from '../components/Layout'
import BlogCover, { foundationModelsSlug } from '../components/BlogCover'
import PublicationDate from '../components/PublicationDate'
import SeoHead from '../components/SeoHead'
import '../styles/editorial.css'

type PostLink = { path: string; title: string; date?: string | null }
type BlogPostContext = {
  title?: string
  excerpt?: string
  date?: string | null
  i18n?: { language?: string; defaultLanguage?: string }
  previous?: PostLink | null
  next?: PostLink | null
}

type BlogPostData = {
  markdownRemark?: {
    html: string
    excerpt?: string
    frontmatter?: { title?: string; date?: string; language?: string }
  }
}

const BlogPost = (props: PageProps<BlogPostData, BlogPostContext>) => {
  const { data, pageContext, location } = props
  const { t } = useTranslation()
  const language = pageContext.i18n?.language || 'en'
  const langPrefix = language === (pageContext.i18n?.defaultLanguage || 'en') ? '' : `/${language}`
  const post = data.markdownRemark
  const title = pageContext.title || post?.frontmatter?.title || t('blog.post_default_title')
  const date = pageContext.date || post?.frontmatter?.date
  const showCover = location.pathname.endsWith(`/${foundationModelsSlug}/`)
  const related = [
    { label: 'blog.newer', post: pageContext.previous, arrow: '←' },
    { label: 'blog.older', post: pageContext.next, arrow: '→' },
  ]

  return (
    <Layout pageProps={props} className="editorial editorial-blog-post">
      <article className="editorial-shell blog-post">
        <header className="blog-post-header">
          <Link to={`${langPrefix}/blog/`} className="editorial-back"><span aria-hidden="true">←</span>{t('blog.title')}</Link>
          {date && <p className="editorial-date"><PublicationDate date={date} language={language} /></p>}
          <h1>{title}</h1>
          {pageContext.excerpt && <p className="blog-post-deck">{pageContext.excerpt}</p>}
        </header>
        {showCover && <BlogCover />}
        <div className="blog-post-content editorial-prose prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: post?.html || '' }} />
        {related.some(item => item.post) && (
          <nav className="blog-related" aria-labelledby="blog-related-title">
            <h2 id="blog-related-title">{t('blog.more_articles')}</h2>
            <div className="blog-related-grid">
              {related.map(({ label, post, arrow }) => post && (
                <Link key={post.path} to={post.path} className="blog-related-link">
                  <span>{t(label)}</span>
                  <strong>{post.title}</strong>
                  <span className="editorial-arrow" aria-hidden="true">{arrow}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </article>
    </Layout>
  )
}

export const Head: HeadFC<BlogPostData, BlogPostContext> = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const canonicalPath = location.pathname.replace(/^\/(?:en|zh)(?=\/blog\/)/, '')
  return (
    <SeoHead
      title={pageContext.title || post?.frontmatter?.title}
      description={pageContext.excerpt || post?.excerpt}
      lang={post?.frontmatter?.language || 'zh'}
      pathname={canonicalPath}
      type="article"
    />
  )
}

export const query = graphql`
  query BlogPostById($id: String, $language: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 155)
      frontmatter {
        title
        date
        language
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
