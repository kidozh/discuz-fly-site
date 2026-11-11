import * as React from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import { useTranslation } from 'gatsby-plugin-react-i18next'

const screens = [
  { id: 'forums', label: 'home_preview_forums' },
  { id: 'reading', label: 'home_preview_reading' },
  { id: 'summary', label: 'home_preview_summary' },
] as const

type Screen = typeof screens[number]['id']

export default function ProductPreview() {
  const { t } = useTranslation()
  const [active, setActive] = React.useState<Screen>('reading')

  return (
    <div className="home-preview">
      <div className="home-preview-stage" id="home-preview-screen">
        <div className="home-preview-orbit home-preview-orbit-inner" aria-hidden="true" />
        <div className="home-preview-orbit home-preview-orbit-outer" aria-hidden="true" />
        <div className="home-preview-device home-preview-device-back" aria-hidden="true">
          <div className="home-preview-crop">
            {active === 'forums' ? (
              <StaticImage src="../../images/iphone-reading.webp" alt="" width={640} />
            ) : (
              <StaticImage src="../../images/iphone-home.webp" alt="" width={640} />
            )}
          </div>
        </div>
        <div className="home-preview-device home-preview-device-front" aria-live="polite">
          <figure key={active} className={`home-preview-crop home-preview-crop-${active}`}>
            {active === 'forums' && (
              <StaticImage src="../../images/iphone-home.webp" alt={t('home_preview_forums_alt')} width={640} loading="eager" />
            )}
            {active === 'reading' && (
              <StaticImage src="../../images/iphone-reading.webp" alt={t('home_preview_alt')} width={640} loading="eager" />
            )}
            {active === 'summary' && (
              <StaticImage src="../../images/iphone-summary.webp" alt={t('home_preview_summary_alt')} width={640} loading="eager" />
            )}
          </figure>
        </div>
      </div>
      <div className="home-preview-controls" role="group" aria-label={String(t('home_preview_label'))}>
        {screens.map(({ id, label }) => (
          <button key={id} type="button" aria-controls="home-preview-screen" aria-pressed={active === id} onClick={() => setActive(id)}>
            {t(label)}
          </button>
        ))}
      </div>
    </div>
  )
}
