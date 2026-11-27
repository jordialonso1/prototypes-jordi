import { useCallback, useLayoutEffect, useRef, useState } from 'react'

const PROTOTYPE_URL = './prototype/index.html'
const DEVICE_WIDTH = 390
const DEVICE_HEIGHT = 844
const PAGE_BOTTOM_PADDING = 32
const PAGE_SIDE_PADDING = 16
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
  const sideRef = useRef<HTMLElement>(null)
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

  /* Fit the device into the viewport (same approach as the AI label prototype):
     scale it down, never up. */
  useLayoutEffect(() => {
    const update = () => {
      const slot = slotRef.current
      if (!slot) return
      const availableHeight =
        window.innerHeight - slot.getBoundingClientRect().top - PAGE_BOTTOM_PADDING
      const availableWidth = window.innerWidth - PAGE_SIDE_PADDING * 2
      const fit = Math.min(availableHeight / DEVICE_HEIGHT, availableWidth / DEVICE_WIDTH)
      setScale(Math.min(1, Math.max(MIN_SCALE, fit)))
    }
    update()
    window.addEventListener('resize', update)
    const observer = new ResizeObserver(update)
    if (sideRef.current) observer.observe(sideRef.current)
    return () => {
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [])

  return (
    <main className="page">
      <aside className="page__side" ref={sideRef}>
        <header className="page__header">
          <h1 className="page__title">PNA / CNA replacements</h1>
        </header>
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
      </aside>
      <div
        className="device-slot"
        ref={slotRef}
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
    </main>
  )
}
