import * as React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, type IGatsbyImageData } from 'gatsby-plugin-image'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import '../../styles/home-screenshots.css'

type ScreenshotFile = {
  name: string
  publicURL: string
  childImageSharp: {
    gatsbyImageData: IGatsbyImageData
    original: { width: number; height: number }
  }
}

type Screenshot = { file: ScreenshotFile; description: string }

const ScreenshotContext = React.createContext<{
  files: Record<string, ScreenshotFile>
  open: (screenshot: Screenshot) => void
} | null>(null)

const dialogId = 'home-screenshot-dialog'
const zoomLevels = [1, 1.5, 2, 3, 4]

export function HomeScreenshotGallery({ children }: { children: React.ReactNode }) {
  const { screenshots } = useStaticQuery<{ screenshots: { nodes: ScreenshotFile[] } }>(graphql`
    query HomeScreenshotFiles {
      screenshots: allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { eq: "home" } }) {
        nodes {
          name
          publicURL
          childImageSharp {
            original { width height }
            gatsbyImageData(layout: FULL_WIDTH, breakpoints: [160, 240, 360, 520, 720, 1120], placeholder: DOMINANT_COLOR)
          }
        }
      }
    }
  `)
  const [selected, setSelected] = React.useState<Screenshot | null>(null)
  const gallery = React.useMemo(() => ({
    files: Object.fromEntries(screenshots.nodes.map(file => [file.name, file])),
    open: setSelected,
  }), [screenshots.nodes])

  return (
    <ScreenshotContext.Provider value={gallery}>
      {children}
      <ScreenshotDialog selected={selected} onClose={() => setSelected(null)} />
    </ScreenshotContext.Provider>
  )
}

type HomeScreenshotProps = {
  name: string
  description: string
  className?: string
  sizes?: string
  eager?: boolean
  inactive?: boolean
}

export function HomeScreenshot({
  name,
  description,
  className = '',
  sizes = '(max-width: 640px) 45vw, 240px',
  eager = false,
  inactive = false,
}: HomeScreenshotProps) {
  const { t } = useTranslation()
  const gallery = React.useContext(ScreenshotContext)
  const file = gallery?.files[name]
  if (!gallery || !file?.childImageSharp) throw new Error(`Missing home screenshot: ${name}`)

  return (
    <button
      type="button"
      className={`home-screenshot ${className}`}
      aria-label={String(t('home_screenshot_open', { description }))}
      aria-controls={dialogId}
      aria-haspopup="dialog"
      aria-hidden={inactive}
      disabled={inactive}
      onClick={() => gallery.open({ file, description })}
    >
      <GatsbyImage
        as="span"
        image={file.childImageSharp.gatsbyImageData}
        alt={description}
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
      />
      <span className="home-screenshot-expand" aria-hidden="true" />
    </button>
  )
}

function ScreenshotDialog({ selected, onClose }: { selected: Screenshot | null; onClose: () => void }) {
  const { t } = useTranslation()
  const dialog = React.useRef<HTMLDialogElement>(null)
  const closeButton = React.useRef<HTMLButtonElement>(null)
  const viewport = React.useRef<HTMLDivElement>(null)
  const [zoomStep, setZoomStep] = React.useState(0)
  const zoom = zoomLevels[zoomStep]

  React.useEffect(() => {
    if (!selected || !dialog.current || dialog.current.open) return
    dialog.current.showModal()
    closeButton.current?.focus()
    viewport.current?.scrollTo(0, 0)
  }, [selected])

  function resetZoom() {
    setZoomStep(0)
    viewport.current?.scrollTo(0, 0)
  }

  function closeDialog() {
    dialog.current?.close()
    resetZoom()
    onClose()
  }

  const dimensions = selected?.file.childImageSharp.original

  return (
    <dialog
      ref={dialog}
      id={dialogId}
      className="home-screenshot-dialog"
      aria-labelledby="home-screenshot-title"
      onCancel={event => {
        event.preventDefault()
        closeDialog()
      }}
      onClick={event => {
        if (event.target === event.currentTarget) closeDialog()
      }}
    >
      {selected && dimensions && (
        <>
          <header className="home-screenshot-toolbar">
            <h2 id="home-screenshot-title">{selected.description}</h2>
            <div className="home-screenshot-zoom" role="group" aria-label={String(t('home_screenshot_zoom'))}>
              <button
                type="button"
                aria-label={String(t('home_screenshot_zoom_out'))}
                disabled={zoomStep === 0}
                onClick={() => setZoomStep(step => step - 1)}
              >−</button>
              <button type="button" onClick={resetZoom}>
                {zoomStep === 0 ? t('home_screenshot_fit') : `${zoom}×`}
                {zoomStep > 0 && <span className="sr-only"> {t('home_screenshot_reset')}</span>}
              </button>
              <button
                type="button"
                aria-label={String(t('home_screenshot_zoom_in'))}
                disabled={zoomStep === zoomLevels.length - 1}
                onClick={() => setZoomStep(step => step + 1)}
              >+</button>
            </div>
            <button type="button" className="home-screenshot-close" ref={closeButton} onClick={closeDialog}>
              {t('home_screenshot_close')}
            </button>
          </header>
          <div
            className="home-screenshot-scroll"
            ref={viewport}
            role="region"
            tabIndex={0}
            aria-label={String(t('home_screenshot_view'))}
            style={{
              '--screenshot-zoom': zoom,
              '--screenshot-ratio': dimensions.width / dimensions.height,
              '--screenshot-native-width': `${dimensions.width}px`,
            } as React.CSSProperties}
          >
            <img src={selected.file.publicURL} alt={selected.description} width={dimensions.width} height={dimensions.height} draggable={false} />
          </div>
        </>
      )}
    </dialog>
  )
}
