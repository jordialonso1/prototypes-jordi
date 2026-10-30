import OtpScreen from './OtpScreen'

export default function OtpEmail() {
  return (
    <OtpScreen
      id="otp-email"
      title="Enter the code from your Email"
      body="Insert the 6-digit verification code that we sent via email to jo********o@glovoapp.com"
      helper="Resend code in 00:26"
      cells={6}
      suggestion={['From Email', '9700']}
    />
  )
}
