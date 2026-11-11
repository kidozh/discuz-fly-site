import * as React from 'react'
import { graphql, type HeadFC, type PageProps } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Layout from '../components/Layout'
import LocalizedLink from '../components/LocalizedLink'
import ProductPreview from '../components/home/ProductPreview'
import SeoHead from '../components/SeoHead'
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

const guides = [
  { title: 'home_android_translation', description: 'home_android_translation_desc', path: 'android-translation' },
  { title: 'home_on_device_ai', description: 'home_on_device_ai_desc', path: 'intelligence-service' },
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
              <a href="#home-guides">{t('home_guides_title')} <span aria-hidden="true">↓</span></a>
            </div>
          </div>

          <ProductPreview />
        </div>
      </section>

      <section className="home-shell home-section" aria-labelledby="home-guides">
        <h2 id="home-guides" className="home-section-heading">{t('home_guides_title')}</h2>
        <div className="home-guide-grid">
          {guides.map(({ title, description, path }) => (
            <LocalizedLink key={path} to={`/doc/${path}/`} className={`home-guide home-guide-${path}`}>
              <div>
                <h3>{t(title)}</h3>
                <p>{t(description)}</p>
              </div>
              <span className="home-card-arrow" aria-hidden="true">→</span>
            </LocalizedLink>
          ))}
        </div>
      </section>

      <section className="home-shell home-section" aria-labelledby="home-features">
        <h2 id="home-features" className="home-section-heading">{t('home_features_title')}</h2>
        <div className="home-feature-grid">
          <article className="home-feature home-feature-reading">
            <div>
              <h3>{t('home_feature_reading_title')}</h3>
              <p>{t('home_feature_reading_desc')}</p>
            </div>
            <div className="home-tablet">
              <StaticImage src="../images/ipad-reading.webp" alt={t('home_preview_tablet_alt')} width={960} />
            </div>
          </article>
          {['forums', 'reminders'].map((feature) => (
            <article key={feature} className={`home-feature home-feature-${feature}`}>
              <h3>{t(`home_feature_${feature}_title`)}</h3>
              <p>{t(`home_feature_${feature}_desc`)}</p>
            </article>
          ))}
        </div>
      </section>

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
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC<unknown, { language?: string }> = ({ pageContext, location }) => {
  const isChinese = pageContext.language === 'zh'
  const copy = isChinese ? zh : en
  return <SeoHead title={copy.home_hero_eyebrow} description={copy.home_hero_subtitle} lang={isChinese ? 'zh' : 'en'} pathname={location.pathname} />
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
