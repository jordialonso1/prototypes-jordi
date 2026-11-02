import { useEffect, useState } from 'react'
import Start from './screens/Start'
import OtpPhone from './screens/OtpPhone'
import OtpEmail from './screens/OtpEmail'
import Protect from './screens/Protect'
import { WelcomeBackPhone, WelcomeBackEmail } from './screens/WelcomeBack'
import { EmailStart, EmailProtect, Name } from './screens/FieldScreens'
import { Password, WelcomeBackEmailPassword } from './screens/PasswordScreens'

/* Screens still waiting for their Figma design. Keep ids in sync with SCREENS
   in ../flow.ts. */
const STUBS: Record<string, string> = {
  'input-otp': 'Input OTP',
  'welcome-no-methods': 'Welcome back! No linked methods',
  'verify-otp': 'Verify OTP',
}

/* Screens built from Figma, keyed by their data-screen id (the ids the map
   nodes in ../flow.ts point to). */
const SCREENS: Record<string, () => React.ReactElement> = {
  start: () => <Start />,
  'start-phone': () => <Start id="start-phone" phone="612 345 678" />,
  'otp-phone': () => <OtpPhone />,
  'otp-email': () => <OtpEmail />,
  protect: () => <Protect />,
  'welcome-back-phone': () => <WelcomeBackPhone />,
  'welcome-back-email': () => <WelcomeBackEmail />,
  'email-start': () => <EmailStart />,
  'email-protect': () => <EmailProtect />,
  name: () => <Name />,
  password: () => <Password />,
  'welcome-back-email-password': () => <WelcomeBackEmailPassword />,
}

function Stub({ title }: { title: string }) {
  return (
    <section className="stub" aria-label={title}>
      <h1>{title}</h1>
    </section>
  )
}

/* Left: logic map (parent page). Right: this prototype. The parent posts
   `goto-screen` / `set-flags` messages. */
export default function PrototypeApp() {
  /* `?screen=otp-phone` opens a screen directly when the page is used alone. */
  const [screen, setScreen] = useState(() => {
    const id = new URLSearchParams(window.location.search).get('screen') ?? 'start'
    return SCREENS[id] || STUBS[id] ? id : 'start'
  })

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data as { type?: string; screen?: string; highRisk?: boolean } | null
      if (!data) return
      if (data.type === 'goto-screen' && data.screen) {
        const id = data.screen
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
