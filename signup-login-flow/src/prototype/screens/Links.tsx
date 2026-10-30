/* Green bold underlined text links (uds hyperlink tokens, body1 link style). */
export function TextLink({ children }: { children: string }) {
  return (
    <a
      href="#"
      className="link pintxo-typography-body1-link"
      onClick={(e) => e.preventDefault()}
    >
      {children}
    </a>
  )
}

export function ResetAccount() {
  return (
    <p className="pintxo-typography-body1 reset-account">
      This is not you? <TextLink>Reset your account</TextLink>
    </p>
  )
}
