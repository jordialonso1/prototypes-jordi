import appleLogo from '../assets/icon-apple.svg'
import googleLogo from '../assets/icon-google.svg'

/* Third-party brand logos exported from Figma (uds-react has no Apple/Google
   icons). Rendered in a 24px box like the Button leading icon. */
export function AppleIcon() {
  return (
    <span className="brand-icon">
      <img src={appleLogo} alt="" />
    </span>
  )
}

export function GoogleIcon() {
  return (
    <span className="brand-icon">
      <img src={googleLogo} alt="" />
    </span>
  )
}
