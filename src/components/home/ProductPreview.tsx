import * as React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import { HomeScreenshot } from './HomeScreenshots'

const screens = [
  { id: 'forums', label: 'home_preview_forums', name: 'iphone-home', description: 'home_preview_forums_alt' },
  { id: 'reading', label: 'home_preview_reading', name: 'iphone-reading', description: 'home_preview_alt' },
  { id: 'summary', label: 'home_preview_summary', name: 'iphone-ai-summary', description: 'home_preview_summary_alt' },
] as const

export default function ProductPreview() {
  const { t } = useTranslation()
  const [active, setActive] = React.useState(1)
  const front = screens[active]
  const back = screens[active === 0 ? 1 : 0]

  return (
    <div className="home-preview">
      <div className="home-preview-stage" id="home-preview-screen">
        <div className="home-preview-orbit home-preview-orbit-inner" aria-hidden="true" />
        <div className="home-preview-orbit home-preview-orbit-outer" aria-hidden="true" />
        <div className="home-preview-device home-preview-device-back">
          <HomeScreenshot className="home-preview-display" name={back.name} description={t(back.description)} eager />
        </div>
        <div className="home-preview-device home-preview-device-front" aria-live="polite">
          <HomeScreenshot key={front.id} className="home-preview-display" name={front.name} description={t(front.description)} eager />
        </div>
      </div>
      <div className="home-preview-controls home-segmented" role="group" aria-label={String(t('home_preview_label'))}>
        {screens.map(({ id, label }, index) => (
          <button key={id} type="button" aria-controls="home-preview-screen" aria-pressed={active === index} onClick={() => setActive(index)}>
            {t(label)}
          </button>
        ))}
      </div>
    </div>
  )
}
