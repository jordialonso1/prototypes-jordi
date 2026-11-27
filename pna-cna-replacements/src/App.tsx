import { useCallback, useLayoutEffect, useRef, useState } from 'react'

const PROTOTYPE_URL = './prototype/index.html'
const DEVICE_WIDTH = 390
const DEVICE_HEIGHT = 844
const MIN_SCALE = 0.3

/* What we are prototyping. "Currently live" is how the app behaves today; new
   design proposals get added here as further options and reuse the same screens,
   so stakeholders can compare them with the live behaviour. */
const OPTIONS = [{ id: 'live', label: 'Currently live' }] as const

type OptionId = (typeof OPTIONS)[number]['id']

/* The use cases of the Cart screen that exist in the app today. */
const USE_CASES = [
  { id: 'regular', label: 'Regular cart' },
  { id: 'cna', label: 'Missing customisation (CNA)' },
  { id: 'pna', label: 'Out of stock (PNA)' },
] as const

type UseCaseId = (typeof USE_CASES)[number]['id']

/* The page never scrolls: the 390x844 device is scaled down (never up) to fit
   the space left under the header. The first dropdown picks the option being
   prototyped, the second the use case of the Cart screen it shows. */
export default function App() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const [option, setOption] = useState<OptionId>('live')
  const [useCase, setUseCase] = useState<UseCaseId>('regular')
  const [scale, setScale] = useState(1)

  const post = useCallback((screen: UseCaseId) => {
    frameRef.current?.contentWindow?.postMessage(
      { type: 'goto-screen', screen },
      window.location.origin,
    )
  }, [])

  const postOption = useCallback((next: OptionId) => {
    frameRef.current?.contentWindow?.postMessage(
      { type: 'goto-option', option: next },
      window.location.origin,
    )
  }, [])

  const reset = useCallback((screen: UseCaseId) => {
    frameRef.current?.contentWindow?.postMessage(
      { type: 'reset-screen', screen },
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
        <h1 className="page__title">PNA / CNA replacements</h1>
        <div className="page__controls">
          <label className="page__select">
            <span>Option</span>
            <select
              value={option}
              onChange={(e) => {
                const next = e.target.value as OptionId
                setOption(next)
                postOption(next)
              }}
            >
              {OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="page__select">
            <span>Use case</span>
            <select
              value={useCase}
              onChange={(e) => {
                const next = e.target.value as UseCaseId
                setUseCase(next)
                post(next)
              }}
            >
              {USE_CASES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="page__reset" onClick={() => reset(useCase)}>
            Reset
          </button>
        </div>
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
                onLoad={() => {
                  postOption(option)
                  post(useCase)
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
