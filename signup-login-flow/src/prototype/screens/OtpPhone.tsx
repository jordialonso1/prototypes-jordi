import { ArrowBackwardIcon, BackspaceIcon, BaseInput, Field, IconButton, Typography } from '@uds/components'
import statusBar from '../assets/statusbar.svg'

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

/* Static replica of the iOS numeric keypad shown in the Figma frame. */
function Keyboard() {
  return (
    <div className="keyboard" aria-hidden="true">
      <div className="keyboard__suggestion">
        <span>From WhatsApp app</span>
        <span>0478</span>
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

export default function OtpPhone() {
  return (
    <section className="screen otp" data-screen="otp-phone" aria-label="Enter the code">
      <img className="status-bar" src={statusBar} alt="" />

      <header className="otp__nav">
        <IconButton variant="neutral" size="s" icon={ArrowBackwardIcon} aria-label="Back" />
      </header>

      <div className="otp__content">
        <div className="otp__heading">
          <Typography variant="title1" as="h1" color="primary" className="otp__title">
            Enter the code
          </Typography>
          <Typography variant="body1" color="primary">
            Insert the 4-digit verification code that we sent via WhatsApp to +34 634 123 456
          </Typography>
        </div>

        <Field label="Code" helperLabel="Resend code or receive via SMS in 00:26">
          <div className="otp__pin" role="group" aria-label="Code">
            {[0, 1, 2, 3].map((i) => (
              <BaseInput
                key={i}
                className="otp__cell"
                size="l"
                type="text"
                inputMode="numeric"
                maxLength={1}
                clearable={false}
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>
        </Field>
      </div>

      <Keyboard />
      <div className="home-indicator" />
    </section>
  )
}
