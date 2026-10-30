import OtpScreen from './OtpScreen'

export default function OtpPhone() {
  return (
    <OtpScreen
      id="otp-phone"
      title="Enter the code"
      body="Insert the 4-digit verification code that we sent via WhatsApp to +34 634 123 456"
      helper="Resend code or receive via SMS in 00:26"
      cells={4}
      suggestion={['From WhatsApp app', '0478']}
    />
  )
}
