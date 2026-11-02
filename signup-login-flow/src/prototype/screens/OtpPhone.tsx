import OtpScreen from './OtpScreen'

/* `code` prefills the PIN boxes (used by the S04 variant of the screen). */
export default function OtpPhone({ id = 'otp-phone', code }: { id?: string; code?: string }) {
  return (
    <OtpScreen
      id={id}
      title="Enter the code"
      body="Insert the 4-digit verification code that we sent via WhatsApp to +34 634 123 456"
      helper="Resend code or receive via SMS in 00:26"
      cells={4}
      suggestion={['From WhatsApp app', '0478']}
      code={code}
    />
  )
}
