import { useCallback, useEffect, useRef, useState } from 'react'
import { SCREENS, type LibraryScreen } from './screens'

const DEVICE_WIDTH = 390
const DEVICE_HEIGHT = 844
const THUMB_SCALE = 0.5
const FULL_MAX_HEIGHT = 0.86

function Preview({ screen, scale }: { screen: LibraryScreen; scale: number }) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const post = useCallback(() => {
    if (!screen.screen) return
    frameRef.current?.contentWindow?.postMessage(
      { type: 'goto-screen', screen: screen.screen },
      window.location.origin,
    )
  }, [screen.screen])

  if (!screen.src) {
    return (
      <div className="preview preview--pending" style={{ width: DEVICE_WIDTH * scale, height: DEVICE_HEIGHT * scale }}>
        <span>Not on main yet</span>
      </div>
    )
  }
  return (
    <div className="preview" style={{ width: DEVICE_WIDTH * scale, height: DEVICE_HEIGHT * scale }}>
      <iframe
        ref={frameRef}
        className="preview__frame"
        title={screen.title}
        src={screen.src}
        loading="lazy"
        style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT, transform: `scale(${scale})` }}
        onLoad={post}
      />
    </div>
  )
}

export default function App() {
  const [open, setOpen] = useState<LibraryScreen | null>(null)
  const [fullScale, setFullScale] = useState(1)

  useEffect(() => {
    const fit = () =>
      setFullScale(Math.min(1, (window.innerHeight * FULL_MAX_HEIGHT) / DEVICE_HEIGHT))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const sources = [...new Set(SCREENS.map((s) => s.source))]

  return (
    <main className="lib">
      <header>
        <h1 className="lib__title">Screen library</h1>
        <p className="lib__intro">
          Every individual screen designed across the prototypes, ready to reuse. Click a screen to
          open it full size and interact with it.
        </p>
      </header>

      {sources.map((source) => (
        <section key={source} className="lib__group" aria-label={source}>
          <h2 className="lib__group-title">{source}</h2>
          <ul className="lib__grid">
            {SCREENS.filter((s) => s.source === source).map((s) => (
              <li key={s.id} className="card">
                <button
                  type="button"
                  className="card__thumb"
                  disabled={!s.src}
                  onClick={() => setOpen(s)}
                  aria-label={`Open ${s.title}`}
                >
                  <Preview screen={s} scale={THUMB_SCALE} />
                </button>
                <h3 className="card__title">{s.title}</h3>
                <p className="card__desc">{s.pending ?? s.description}</p>
                {s.screen && <code className="card__id">{s.source} / {s.screen}</code>}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {open && (
        <div className="overlay" onClick={() => setOpen(null)} role="dialog" aria-label={open.title}>
          <div className="overlay__body" onClick={(e) => e.stopPropagation()}>
            <div className="overlay__bar">
              <strong>{open.title}</strong>
              <button type="button" className="overlay__close" onClick={() => setOpen(null)}>
                Close
              </button>
            </div>
            <Preview screen={open} scale={fullScale} />
          </div>
        </div>
      )}
    </main>
  )
}
