import { BaseInput, Field, Typography } from '@uds/components'
import { HomeIndicator, Keyboard, NavBar, StatusBar } from './Chrome'

interface OtpScreenProps {
  id: string
  title: string
  body: string
  helper: string
  cells: number
  suggestion: [string, string]
}

/* Verification-code screen: title, body, PIN boxes and the numeric keyboard. */
export default function OtpScreen({ id, title, body, helper, cells, suggestion }: OtpScreenProps) {
  return (
    <section className="screen otp" data-screen={id} aria-label={title}>
      <StatusBar />
      <NavBar />

      <div className="otp__content">
        <div className="otp__heading">
          <Typography variant="title1" as="h1" color="primary">
            {title}
          </Typography>
          <Typography variant="body1" color="primary">
            {body}
          </Typography>
        </div>

        <Field label="Code" helperLabel={helper}>
          <div className="otp__pin" role="group" aria-label="Code">
            {Array.from({ length: cells }, (_, i) => (
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

      <Keyboard suggestion={suggestion} />
      <HomeIndicator />
    </section>
  )
}
