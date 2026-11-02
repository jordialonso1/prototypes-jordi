import { EnvelopeIcon, TextField } from '@uds/components'
import FormScreen from './FormScreen'

interface FieldScreenProps {
  id: string
  title: string
  body: string
  label: string
  withEmailIcon?: boolean
}

function FieldScreen({ id, title, body, label, withEmailIcon }: FieldScreenProps) {
  return (
    <FormScreen id={id} title={title} body={body} withContinue>
      <TextField
        label={label}
        aria-label={label}
        size="m"
        type={withEmailIcon ? 'email' : 'text'}
        leadingIcon={withEmailIcon ? EnvelopeIcon : undefined}
      />
    </FormScreen>
  )
}

export function EmailStart() {
  return (
    <FieldScreen
      id="email-start"
      title="Let’s start with your email"
      body="We’ll check if you already have an account. If not, we’ll create a new one."
      label="Email"
      withEmailIcon
    />
  )
}

export function EmailProtect() {
  return (
    <FieldScreen
      id="email-protect"
      title="Enter your email"
      body="Add your email to have a way to recover your account in case you lose access."
      label="Email"
      withEmailIcon
    />
  )
}

export function Name() {
  return (
    <FieldScreen
      id="name"
      title="What is your name?"
      body="Nearly there! Just tell us what you want us to call you in your profile."
      label="Name"
    />
  )
}
