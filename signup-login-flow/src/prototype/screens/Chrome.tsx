import { ArrowBackwardIcon, BackspaceIcon, IconButton } from '@uds/components'
import statusBarSrc from '../assets/statusbar.svg'

/* Shared iOS chrome and navigation used by every screen (static replicas of the
   Figma frames). */

export function StatusBar() {
  return <img className="status-bar" src={statusBarSrc} alt="" />
}

export function HomeIndicator() {
  return <div className="home-indicator" />
}

export function NavBar() {
  return (
    <header className="nav-bar">
      <IconButton variant="neutral" size="s" icon={ArrowBackwardIcon} aria-label="Back" />
    </header>
  )
}

const KEYS: { digit: string; letters: string }[] = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
]

/* Static replica of the iOS numeric keypad. `suggestion` is the autofill
   proposal shown above the keys, e.g. ['From WhatsApp app', '0478']. */
export function Keyboard({ suggestion }: { suggestion: [string, string] }) {
  return (
    <div className="keyboard" aria-hidden="true">
      <div className="keyboard__suggestion">
        <span>{suggestion[0]}</span>
        <span>{suggestion[1]}</span>
      </div>
      <div className="keyboard__keys">
        {KEYS.map((k) => (
          <div className="key" key={k.digit}>
            <span className="key__digit">{k.digit}</span>
            {k.letters && <span className="key__letters">{k.letters}</span>}
          </div>
        ))}
        <div className="key key--empty" />
        <div className="key">
          <span className="key__digit">0</span>
        </div>
        <div className="key key--empty">
          <BackspaceIcon />
        </div>
      </div>
    </div>
  )
}
