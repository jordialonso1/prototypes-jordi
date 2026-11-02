import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@uds/generated/style/core-theme.scss'
import '@uds/generated/style/responsiveness.scss'
import '@uds/generated/style/typography-classes.scss'
import './prototype.css'
import PrototypeApp from './PrototypeApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrototypeApp />
  </StrictMode>,
)
