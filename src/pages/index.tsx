import * as React from "react"
import { graphql, type HeadFC, type PageProps } from "gatsby"
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Layout from "../components/Layout"
import SeoHead from '../components/SeoHead'
import CtaTrust from '../components/CtaTrust'

// Using Tailwind + theme utilities for layout and colors

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

const IndexPage: React.FC<PageProps> = () => {
  const { t } = useTranslation()

  return (
    <Layout pageProps={{}}>
      <CtaTrust />
      <main className="min-h-screen font-sans bg-theme text-theme transition-colors">
        <section className="relative overflow-hidden relative-blobs">
          <div className="absolute -left-28 -top-24 pointer-events-none">
            <span aria-hidden="true" className="bg-blob blob-3" />
          </div>
          <div className="absolute -right-16 bottom-8 pointer-events-none">
            <span aria-hidden="true" className="bg-blob blob-2" />
          </div>
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{t('home_hero_title')}</h1>
                <p className="text-lg text-muted mb-6">{t('home_hero_subtitle')}</p>

                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex gap-2 items-center">
                    <a href="https://play.google.com/store/apps/details?id=com.kidozh.discuz_flutter" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-800 to-blue-600 text-blue-100 dark:text-blue-100 font-medium shadow-lg transform transition-all hover:-translate-y-0.5" aria-label={String(t('home_source_code'))}>
                      <span>{t('home_source_code')}</span>
                    </a>

                    <a href="https://apps.apple.com/us/app/%E8%B0%88%E5%9D%9B/id1601703772" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-600 text-white text-base font-medium shadow-lg transform transition-all hover:-translate-y-0.5 dark:from-white dark:to-gray-300 dark:text-black" aria-label={String(t('home_push_service'))}>
                      <span className="text-base">{t('home_push_service')}</span>
                    </a>
                  </div>

                  {/* <a
                    href="https://github.com/kidozh/discuz_flutter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white hover:bg-zinc-800 dark:bg-zinc-900 dark:text-slate-100 dark:hover:bg-zinc-800"
                    aria-label={String(t('home_source_code'))}
                    >
                    
                    <span className="text-sm font-medium">{t('home_source_code')}</span>
                  </a>

                  <a
                    href="https://dhp.kidozh.com"
                    className="inline-block px-4 py-2 bg-transparent border border-gray-200 rounded-md hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    aria-label={String(t('home_push_service'))}
                  >
                    {t('home_push_service')}
                  </a> */}
                </div>
              </div>

              <div className="order-first lg:order-last">
                <div className="w-full rounded-lg shadow-lg overflow-hidden 
                bg-gradient-to-br from-slate-800 to-slate-700 p-6 text-white">
                  <div className="text-sm font-medium mb-2">{t('home_latest_release_label')}</div>
                  <div className="text-2xl font-semibold mb-2">{t('home_latest_release_version')}</div>
                  <p className="text-sm text-slate-200">{t('home_latest_release_note')}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1 bg-white/10 rounded">{t('home_release_notes')}</button>
                    <button className="px-3 py-1 bg-white/10 rounded">{t('home_download')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-theme-alt py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-6">{t('home_features_title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform dark:bg-slate-800 dark:border dark:border-zinc-700">
                <h3 className="font-semibold mb-2 text-theme">{t('home_feat_performance_title')}</h3>
                <p className="text-sm text-muted">{t('home_feat_performance_desc')}</p>
              </div>
              <div className="p-6 bg-slate-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform dark:bg-slate-800 dark:border dark:border-zinc-700">
                <h3 className="font-semibold mb-2 text-theme">{t('home_feature_open_source_title')}</h3>
                <p className="text-sm text-muted">{t('home_feature_open_source_desc')}</p>
              </div>
              <div className="p-6 bg-slate-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform dark:bg-slate-800 dark:border dark:border-zinc-700">
                <h3 className="font-semibold mb-2 text-theme">{t('home_feat_cross_title')}</h3>
                <p className="text-sm text-muted">{t('home_feat_cross_desc')}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-6">{t('home_explore_title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'keylol', desc: t('explore_keylol_desc'), url: 'https://keylol.com' },
                { title: 'QZZN', desc: t('explore_qzzn_desc'), url: 'https://bbs.qzzn.com' },
                { title: '北京交通知行', desc: t('explore_bjt_zx_desc'), url: 'https://zhixing.bjtu.edu.cn' },
                { title: 'stage1st', desc: t('explore_stage1st_desc'), url: 'https://stage1st.com' },
                { title: '远景论坛', desc: t('explore_vista_desc'), url: 'https://bbs.pcbeta.com' },
                { title: '瀚思彼岸', desc: t('explore_hassbian_desc'), url: 'https://bbs.hassbian.com' },
              ].map((it, i) => (
                <article key={i} className="border rounded-lg hover:shadow-lg transition-shadow bg-theme-foreground">
                  <a href={it.url} target="_blank" rel="noopener noreferrer" className="block p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-md bg-brand/20 flex items-center justify-center text-brand font-bold">{it.title[0] ?? 'E'}</div>
                      <div>
                        <h3 className="font-semibold">{it.title}</h3>
                        <p className="text-sm text-muted">{it.desc}</p>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
                      
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <SeoHead title="Home Page" description="Discuz Fly site homepage" />

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
