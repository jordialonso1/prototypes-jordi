import { PasswordField, Typography } from '@uds/components'
import FormScreen from './FormScreen'
import { ResetAccount, TextLink } from './Links'

function PasswordScreen({ id, email, withReset }: { id: string; email: string; withReset: boolean }) {
  return (
    <FormScreen
      id={id}
      title="Enter your password"
      body="Use your password to log in to your existing account."
      withContinue
    >
      <div className="form__identity">
        <Typography variant="body1Emphasis" as="p" color="primary">
          {email}
        </Typography>
        {withReset && <ResetAccount />}
      </div>
      <PasswordField label="Password" aria-label="Password" />
      <TextLink>Forgot your password?</TextLink>
    </FormScreen>
  )
}

export function Password() {
  return <PasswordScreen id="password" email="jo********o@glovoapp.com" withReset />
}

export function WelcomeBackEmailPassword() {
  return (
    <PasswordScreen id="welcome-back-email-password" email="jordi.alonso@glovoapp.com" withReset={false} />
  )
}
