import type { ReactNode } from 'react'
import { Button, Typography } from '@uds/components'
import { HomeIndicator, NavBar, StatusBar } from './Chrome'

interface FormScreenProps {
  id: string
  title: string
  body: string
  /** Content below the heading (fields, buttons, links). */
  children?: ReactNode
  /** Disabled primary "Continue" pinned to the bottom. */
  withContinue?: boolean
  /** Content pinned to the bottom instead of the Continue button. */
  footer?: ReactNode
}

/* Shared layout of the single-column screens: back nav, heading, content and a
   bottom area. */
export default function FormScreen({ id, title, body, children, withContinue, footer }: FormScreenProps) {
  return (
    <section className="screen form" data-screen={id} aria-label={title}>
      <StatusBar />
      <NavBar />
      <div className="form__body">
        <div className="form__main">
          <div className="form__heading">
            <Typography variant="title1" as="h1" color="primary">
              {title}
            </Typography>
            <Typography variant="body1" color="primary">
              {body}
            </Typography>
          </div>
          {children}
        </div>
        {withContinue && <Button variant="primary" size="m" label="Continue" disabled block />}
        {footer}
      </div>
      <HomeIndicator />
    </section>
  )
}
