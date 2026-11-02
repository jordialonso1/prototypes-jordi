import OtpScreen from './OtpScreen'

/* `visible` shows the full email address instead of the masked one (S08, S10). */
export default function OtpEmail({ id = 'otp-email', visible = false }: { id?: string; visible?: boolean }) {
  return (
    <OtpScreen
      id={id}
      title="Enter the code from your Email"
      body={`Insert the 6-digit verification code that we sent via email to ${
        visible ? 'jordi.alonso@glovoapp.com' : 'jo********o@glovoapp.com'
      }`}
      helper="Resend code in 00:26"
      cells={6}
      suggestion={['From Email', '9700']}
    />
  )
}
