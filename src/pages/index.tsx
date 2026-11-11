import * as React from 'react'
import { graphql, type HeadFC, type PageProps } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Layout from '../components/Layout'
import HomeFeatures from '../components/home/HomeFeatures'
import { HomeScreenshotGallery } from '../components/home/HomeScreenshots'
import ProductPreview from '../components/home/ProductPreview'
import SeoHead, { bilingualAlternates } from '../components/SeoHead'
import en from '../locales/en/translation.json'
import zh from '../locales/zh/translation.json'
import '../styles/home.css'

const repository = 'https://github.com/kidozh/discuz_flutter'
const releases = `${repository}/releases`

const downloadLinks = [
  { label: 'home_download_appstore', href: 'https://apps.apple.com/us/app/%E8%B0%88%E5%9D%9B/id1601703772' },
  { label: 'home_download_play', href: 'https://play.google.com/store/apps/details?id=com.kidozh.discuz_flutter' },
  { label: 'home_download_apk', href: `${releases}/latest` },
]

const communities = [
  { title: '其乐 Keylol', desc: 'explore_keylol_desc', url: 'https://keylol.com/' },
  { title: 'QZZN', desc: 'explore_qzzn_desc', url: 'https://bbs.qzzn.com/' },
  { title: '北交大知行', desc: 'explore_bjt_zx_desc', url: 'https://zhixing.bjtu.edu.cn/' },
  { title: 'Stage1st', desc: 'explore_stage1st_desc', url: 'https://stage1st.com/2b/' },
  { title: '瀚思彼岸', desc: 'explore_hassbian_desc', url: 'https://bbs.hassbian.com/forum.php' },
]

const IndexPage: React.FC<PageProps> = (props) => {
  const { t } = useTranslation()

  return (
    <Layout pageProps={props} className="disfly-home">
      <HomeScreenshotGallery>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-shell home-hero-layout">
            <div className="home-hero-copy">
              <p className="home-hero-label">{t('home_hero_eyebrow')}</p>
              <h1 id="home-title" className="home-hero-title">
                {t('home_hero_title')} <span>{t('home_hero_title_accent')}</span>
              </h1>
              <p className="home-hero-summary">{t('home_hero_subtitle')}</p>

              <div className="home-downloads">
                {downloadLinks.map(({ label, href }) => (
                  <a key={label} href={href}>{t(label)}</a>
                ))}
              </div>
              <div className="home-hero-links">
                <a href={releases}>{t('home_release_notes')}</a>
                <a href={repository}>{t('home_source_code')}</a>
              </div>
            </div>

            <ProductPreview />
          </div>
        </section>

        <HomeFeatures />

        <section className="home-shell home-section" aria-labelledby="home-communities">
          <h2 id="home-communities" className="home-section-heading">{t('home_explore_title')}</h2>
          <ul className="home-community-list">
            {communities.map(({ title, desc, url }) => (
              <li key={url}>
                <a href={url}>
                  <span className="home-community-name">{title}</span>
                  <span className="home-community-description">{t(desc)}</span>
                  <span className="home-card-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </HomeScreenshotGallery>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC<unknown, { language?: string }> = ({ pageContext, location }) => {
  const isChinese = pageContext.language === 'zh'
  const copy = isChinese ? zh : en
  return <SeoHead title={copy.home_hero_eyebrow} description={copy.home_hero_subtitle} lang={isChinese ? 'zh' : 'en'} pathname={location.pathname} alternates={bilingualAlternates('/')} />
}

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
