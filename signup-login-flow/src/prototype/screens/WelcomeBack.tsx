import type { ReactNode } from 'react'
import { Button, EnvelopeIcon } from '@uds/components'
import FormScreen from './FormScreen'
import { GoogleIcon } from './BrandIcons'
import { ResetAccount } from './Links'

function WelcomeBack({ id, body, withReset }: { id: string; body: ReactNode; withReset: boolean }) {
  return (
    <FormScreen
      id={id}
      title="Welcome back, Jordi"
      body={body}
      footer={withReset ? <ResetAccount /> : undefined}
    >
      <div className="form__stack">
        <Button variant="neutral" size="m" label="Google" leadingIcon={GoogleIcon} block />
        <Button variant="neutral" size="m" label="Email verification" leadingIcon={EnvelopeIcon} block />
        <Button variant="neutral" size="m" label="Password" block />
      </div>
    </FormScreen>
  )
}

/* Phone login: also offers to reset the account at the bottom. */
export function WelcomeBackPhone() {
  return (
    <WelcomeBack
      id="welcome-back-phone"
      body={
        <>
          You already have an account.
          <br />
          Log in using a previously saved method.
        </>
      }
      withReset
    />
  )
}

export function WelcomeBackEmail() {
  return (
    <WelcomeBack id="welcome-back-email" body="Log in using a previously saved method." withReset={false} />
  )
}
