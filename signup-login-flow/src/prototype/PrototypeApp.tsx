import { useEffect, useState } from 'react'
import Start from './screens/Start'
import OtpPhone from './screens/OtpPhone'

/* Screens still waiting for their Figma design. Keep ids in sync with SCREENS
   in ../flow.ts. */
const STUBS: Record<string, string> = {
  'send-otp': 'Send one-time password (OTP)',
  'input-otp': 'Input OTP',
  'protect-account': 'Protect your account',
  'welcome-methods': 'Welcome back! Screen with existing methods',
  'welcome-no-methods': 'Welcome back! No linked methods',
  'welcome-otp': 'Welcome back! Login methods + OTP',
  'verify-otp': 'Verify OTP',
  'verify-password': 'Verify password',
  'email-entry': 'Introduce email',
  'validate-email-otp': 'Validate email OTP page',
  'social-3p': 'Select method and perform steps on 3rd party',
  'send-otp-auto': 'Send OTP automatically (no user input)',
}

/* The map still asks for the old `landing` id; it now resolves to `start`. */
const ALIASES: Record<string, string> = { landing: 'start' }

const SCREENS: Record<string, () => React.ReactElement> = {
  start: () => <Start />,
  'otp-phone': () => <OtpPhone />,
}

function Stub({ title }: { title: string }) {
  return (
    <section className="stub" aria-label={title}>
      <span className="stub__tag">Design pending</span>
      <h1>{title}</h1>
      <p>Placeholder for this screen of the flow map.</p>
    </section>
  )
}

/* Left: logic map (parent page). Right: this prototype. The parent posts
   `goto-screen` / `set-flags` messages. */
export default function PrototypeApp() {
  /* `?screen=otp-phone` opens a screen directly when the page is used alone. */
  const [screen, setScreen] = useState(() => {
    const id = new URLSearchParams(window.location.search).get('screen') ?? 'start'
    const resolved = ALIASES[id] ?? id
    return SCREENS[resolved] || STUBS[resolved] ? resolved : 'start'
  })

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data as { type?: string; screen?: string; highRisk?: boolean } | null
      if (!data) return
      if (data.type === 'goto-screen' && data.screen) {
        const id = ALIASES[data.screen] ?? data.screen
        if (SCREENS[id] || STUBS[id]) setScreen(id)
      }
      /* Screens can restyle with html[data-high-risk="true"] in CSS. */
      if (data.type === 'set-flags') {
        document.documentElement.dataset.highRisk = data.highRisk ? 'true' : 'false'
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const render = SCREENS[screen]
  return render ? render() : <Stub title={STUBS[screen]} />
}
