import { useCallback, useLayoutEffect, useRef, useState } from 'react'

const PROTOTYPE_URL = './prototype/index.html'
const DEVICE_WIDTH = 390
const DEVICE_HEIGHT = 844
const MIN_SCALE = 0.3

const VERSIONS = [
  { id: 'regular', label: 'Regular cart' },
  { id: 'cna', label: 'Missing customisation (CNA)' },
  { id: 'pna', label: 'Out of stock (PNA)' },
] as const

type VersionId = (typeof VERSIONS)[number]['id']

/* The page never scrolls: the 390x844 device is scaled down (never up) to fit
   the space left under the header. The dropdown picks which version of the
   Cart screen the prototype shows. */
export default function App() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const [version, setVersion] = useState<VersionId>('regular')
  const [scale, setScale] = useState(1)

  const post = useCallback((screen: VersionId) => {
    frameRef.current?.contentWindow?.postMessage(
      { type: 'goto-screen', screen },
      window.location.origin,
    )
  }, [])

  useLayoutEffect(() => {
    const el = slotRef.current
    if (!el) return
    const fit = () => {
      const r = el.getBoundingClientRect()
      const s = Math.min(
        1,
        Math.max(MIN_SCALE, Math.min(r.height / DEVICE_HEIGHT, r.width / DEVICE_WIDTH)),
      )
      setScale(s)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Cart: PNA / CNA replacements</h1>
        <label className="page__select">
          <span>Version</span>
          <select
            value={version}
            onChange={(e) => {
              const next = e.target.value as VersionId
              setVersion(next)
              post(next)
            }}
          >
            {VERSIONS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className="page__proto" aria-label="Prototype">
        <div ref={slotRef} className="device-slot">
          <div
            className="device-box"
            style={{ width: DEVICE_WIDTH * scale, height: DEVICE_HEIGHT * scale }}
          >
            <div
              className="device"
              style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT, transform: `scale(${scale})` }}
            >
              <iframe
                ref={frameRef}
                className="device__screen"
                title="Cart prototype"
                src={PROTOTYPE_URL}
                onLoad={() => post(version)}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
