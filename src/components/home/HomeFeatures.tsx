import * as React from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import '../../styles/home-features.css'

const appDocs = 'https://github.com/kidozh/discuz_flutter/blob/master/docs'

type PreviewOptionsProps = {
  label: string
  target: string
  options: string[]
  active: number
  onSelect: (index: number) => void
}

function PreviewOptions({ label, target, options, active, onSelect }: PreviewOptionsProps) {
  return (
    <div className="home-feature-controls home-segmented" role="group" aria-label={label}>
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          aria-controls={target}
          aria-pressed={active === index}
          onClick={() => onSelect(index)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function WideScreenFeature() {
  const { t } = useTranslation()
  const [device, setDevice] = React.useState(0)

  return (
    <article className="home-feature home-feature-reading">
      <div className="home-feature-copy">
        <h3>{t('home_feature_reading_title')}</h3>
        <p>{t('home_feature_reading_desc')}</p>
        <PreviewOptions
          label={t('home_feature_wide_preview')}
          target="home-wide-preview"
          options={['iPad', 'iPhone Duo']}
          active={device}
          onSelect={setDevice}
        />
      </div>
      <div className="home-wide-stage" id="home-wide-preview" aria-live="polite">
        <div className="home-wide-devices home-feature-motion">
          <div className="home-wide-device home-swap" aria-hidden={device !== 0}>
            <StaticImage src="../../images/ipad-reading.webp" alt={t('home_preview_tablet_alt')} width={1120} />
          </div>
          <div className="home-wide-device home-wide-duo home-swap" aria-hidden={device !== 1}>
            <StaticImage src="../../images/home/duo-reading.webp" alt={t('home_preview_duo_alt')} width={1120} />
          </div>
        </div>
      </div>
    </article>
  )
}

function WatchFeature() {
  const { t } = useTranslation()
  const [screen, setScreen] = React.useState(0)

  return (
    <article className="home-feature home-feature-watch">
      <div className="home-feature-copy">
        <h3>{t('home_feature_watch_title')}</h3>
        <p>{t('home_feature_watch_desc')}</p>
        <PreviewOptions
          label={t('home_feature_watch_preview')}
          target="home-watch-preview"
          options={[t('home_feature_watch_inbox'), t('home_feature_watch_reply')]}
          active={screen}
          onSelect={setScreen}
        />
        <a className="home-feature-link" href={`${appDocs}/apple_watch.md`}>{t('home_feature_watch_link')} <span aria-hidden="true">↗</span></a>
      </div>
      <div className="home-watch-stage" id="home-watch-preview" aria-live="polite">
        <div className="home-watch-device home-feature-motion">
          <div className="home-watch-display">
            <div className="home-swap" aria-hidden={screen !== 0}>
              <StaticImage src="../../images/home/watch-inbox.webp" alt={t('home_feature_watch_inbox_alt')} width={416} />
            </div>
            <div className="home-swap" aria-hidden={screen !== 1}>
              <StaticImage src="../../images/home/watch-reply.webp" alt={t('home_feature_watch_reply_alt')} width={416} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

type PhoneStackProps = { children: React.ReactNode }

function PhoneStack({ children }: PhoneStackProps) {
  return (
    <div className="home-phone-stage">
      <div className="home-phone-stack home-feature-motion">{children}</div>
    </div>
  )
}

export default function HomeFeatures() {
  const { t } = useTranslation()

  return (
    <section className="home-shell home-section" aria-labelledby="home-features">
      <h2 id="home-features" className="home-section-heading">{t('home_features_title')}</h2>
      <div className="home-feature-grid">
        <WideScreenFeature />
        <article className="home-feature home-feature-forums">
          <div className="home-feature-copy">
            <h3>{t('home_feature_forums_title')}</h3>
            <p>{t('home_feature_forums_desc')}</p>
          </div>
          <PhoneStack>
            <StaticImage src="../../images/home/iphone-forums.webp" alt={t('home_feature_forums_alt')} width={520} />
            <StaticImage src="../../images/home/iphone-feed.webp" alt={t('home_feature_feed_alt')} width={520} />
          </PhoneStack>
        </article>
        <article className="home-feature home-feature-library">
          <div className="home-feature-copy">
            <h3>{t('home_feature_library_title')}</h3>
            <p>{t('home_feature_library_desc')}</p>
          </div>
          <PhoneStack>
            <StaticImage src="../../images/home/iphone-history.webp" alt={t('home_feature_history_alt')} width={520} />
            <StaticImage src="../../images/home/iphone-favorites.webp" alt={t('home_feature_favorites_alt')} width={520} />
          </PhoneStack>
        </article>
        <WatchFeature />
        <article className="home-feature home-feature-appearance">
          <div className="home-feature-copy">
            <h3>{t('home_feature_appearance_title')}</h3>
            <p>{t('home_feature_appearance_desc')}</p>
          </div>
          <div className="home-appearance-stage">
            <div className="home-feature-motion">
              <StaticImage src="../../images/home/iphone-colors.webp" alt={t('home_feature_appearance_alt')} width={520} />
            </div>
          </div>
        </article>
        <article className="home-feature home-feature-reminders">
          <div className="home-feature-copy">
            <h3>{t('home_feature_reminders_title')}</h3>
            <p>{t('home_feature_reminders_desc')}</p>
          </div>
          <a className="home-feature-link" href={`${appDocs}/android_background_new_posts.md`}>{t('home_feature_reminders_link')} <span aria-hidden="true">↗</span></a>
        </article>
      </div>
    </section>
  )
}
