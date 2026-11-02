import { Button, EnvelopeIcon } from '@uds/components'
import FormScreen from './FormScreen'
import { AppleIcon, GoogleIcon } from './BrandIcons'

export default function Protect() {
  return (
    <FormScreen
      id="protect"
      title="Protect your account"
      body="Choose an option to have a way to recover your account in case you lose access."
    >
      <div className="form__stack">
        <Button variant="neutral" size="m" label="Apple" leadingIcon={AppleIcon} block />
        <Button variant="neutral" size="m" label="Google" leadingIcon={GoogleIcon} block />
        <Button variant="neutral" size="m" label="Email" leadingIcon={EnvelopeIcon} block />
      </div>
    </FormScreen>
  )
}
