import * as React from 'react'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import { HomeScreenshot } from './HomeScreenshots'
import '../../styles/home-features.css'

const GuideLink = Link as unknown as React.ComponentType<Pick<React.ComponentProps<typeof Link>, 'to' | 'className' | 'children'>>

const devices = [
  { label: 'iPad', name: 'ipad-reading', style: '', description: 'home_preview_tablet_alt' },
  { label: 'iPhone Duo', name: 'duo-reading', style: 'home-wide-duo', description: 'home_preview_duo_alt' },
  { label: 'iPhone', name: 'iphone-reading', style: 'home-wide-phone', description: 'home_preview_alt' },
  { label: 'Android', name: 'android-reading', style: 'home-wide-phone', description: 'home_preview_android_alt' },
]

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

function ReadingFeature() {
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
          options={devices.map(({ label }) => label)}
          active={device}
          onSelect={setDevice}
        />
      </div>
      <div className="home-wide-stage" id="home-wide-preview" aria-live="polite">
        <div className="home-wide-devices home-feature-motion">
          {devices.map(({ name, style, description }, index) => (
            <HomeScreenshot
              key={name}
              name={name}
              description={t(description)}
              className={`home-wide-device home-swap ${style}`}
              sizes={style === 'home-wide-phone' ? '(max-width: 640px) 30vw, 176px' : '(max-width: 640px) 78vw, 560px'}
              inactive={device !== index}
            />
          ))}
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
        <GuideLink className="home-feature-link" to="/doc/apple-watch/">{t('home_feature_watch_link')} <span aria-hidden="true">→</span></GuideLink>
      </div>
      <div className="home-watch-stage" id="home-watch-preview" aria-live="polite">
        <div className="home-watch-device home-feature-motion">
          <div className="home-watch-display">
            <HomeScreenshot className="home-swap" name="watch-inbox" description={t('home_feature_watch_inbox_alt')} sizes="176px" inactive={screen !== 0} />
            <HomeScreenshot className="home-swap" name="watch-reply" description={t('home_feature_watch_reply_alt')} sizes="176px" inactive={screen !== 1} />
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
        <ReadingFeature />
        <article className="home-feature home-feature-forums">
          <div className="home-feature-copy">
            <h3>{t('home_feature_forums_title')}</h3>
            <p>{t('home_feature_forums_desc')}</p>
          </div>
          <PhoneStack>
            <HomeScreenshot name="iphone-forums" description={t('home_feature_forums_alt')} />
            <HomeScreenshot name="iphone-feed" description={t('home_feature_feed_alt')} />
          </PhoneStack>
        </article>
        <article className="home-feature home-feature-library">
          <div className="home-feature-copy">
            <h3>{t('home_feature_library_title')}</h3>
            <p>{t('home_feature_library_desc')}</p>
          </div>
          <PhoneStack>
            <HomeScreenshot name="iphone-history" description={t('home_feature_history_alt')} />
            <HomeScreenshot name="iphone-favorites" description={t('home_feature_favorites_alt')} />
          </PhoneStack>
        </article>
        <WatchFeature />
        <article className="home-feature home-feature-appearance">
          <div className="home-feature-copy">
            <h3>{t('home_feature_appearance_title')}</h3>
            <p>{t('home_feature_appearance_desc')}</p>
          </div>
          <div className="home-appearance-stage">
            <HomeScreenshot className="home-feature-motion" name="iphone-colors" description={t('home_feature_appearance_alt')} sizes="160px" />
          </div>
        </article>
        <article className="home-feature home-feature-reminders">
          <div className="home-feature-copy">
            <h3>{t('home_feature_reminders_title')}</h3>
            <p>{t('home_feature_reminders_desc')}</p>
          </div>
          <GuideLink className="home-feature-link" to="/doc/android-background-reminders/">{t('home_feature_reminders_link')} <span aria-hidden="true">→</span></GuideLink>
        </article>
      </div>
    </section>
  )
}
