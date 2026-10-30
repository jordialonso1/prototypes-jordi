import {
  Banner,
  Button,
  ChevronDownIcon,
  ChevronForwardIcon,
  EnvelopeIcon,
  IllustrationBlob,
  MainLogo,
  TextButton,
  TextField,
  Typography,
} from '@uds/components'
import { ShapeList } from '@uds/generated/enums/shape-enum'
import bagMotorbikeConfetti from '@uds/assets/illustrations/bagMotorbikeConfetti.svg'
import hero from '../assets/hero.png'
import curve from '../assets/curve.svg'
import statusBar from '../assets/statusbar.svg'
import appleLogo from '../assets/icon-apple.svg'
import googleLogo from '../assets/icon-google.svg'

export default function Start() {
  return (
    <section className="screen start" data-screen="start" aria-label="Start">
      <div className="start__hero">
        <img className="start__hero-img" src={hero} alt="" />
      </div>
      <MainLogo
        className="start__logo"
        size="m"
        surface="onBrand"
        variant="logotype"
        aria-label="Glovo"
      />

      <div className="start__bottom">
        <img className="start__curve" src={curve} alt="" />
        <div className="start__sheet">
          <Banner
            style="promotion"
            title="First order with free delivery"
            description="For new customers only."
            accessory={
              <IllustrationBlob
                shape={ShapeList.blob01}
                type="promotion"
                size="s"
                src={bagMotorbikeConfetti}
                alt=""
              />
            }
          />

          <div className="start__group">
            <div className="start__heading">
              <Typography variant="title3" color="primary">
                Welcome!
              </Typography>
              <Typography variant="body2" color="secondary">
                Let’s start with your phone number
              </Typography>
            </div>
            <div className="start__phone">
              <TextField
                className="start__prefix"
                label="Prefix"
                aria-label="Prefix"
                value="🇪🇸 +34"
                readonly
                clearable={false}
                trailingIcon={ChevronDownIcon}
                size="m"
              />
              <TextField
                className="start__number"
                label="Phone number"
                aria-label="Phone number"
                type="tel"
                size="m"
              />
            </div>
          </div>

          <div className="start__group">
            <div className="start__row">
              <Button variant="neutral" size="l" label="SMS" />
              <Button variant="primary" size="l" label="WhatsApp" />
            </div>
            <div className="start__alt">
              <Typography variant="body2" color="secondary">
                Or continue with
              </Typography>
              <div className="start__row">
                <Button variant="neutral" size="l" aria-label="Apple">
                  <img src={appleLogo} alt="" />
                </Button>
                <Button variant="neutral" size="l" aria-label="Google">
                  <img src={googleLogo} alt="" />
                </Button>
                <Button variant="neutral" size="l" aria-label="Email" leadingIcon={EnvelopeIcon} />
              </div>
            </div>
          </div>

          <div className="start__more">
            <TextButton
              variant="secondary"
              size="s"
              label="More"
              trailingAccessory={<ChevronForwardIcon />}
              onClick={() => {}}
            />
          </div>

          <Typography variant="caption" color="secondary" className="start__legal">
            By continuing, you automatically accept our{' '}
            <a href="https://glovoapp.com/docs/es/legal/terms?country=es" target="_blank" rel="noreferrer">
              Terms &amp; Conditions
            </a>
            ,{' '}
            <a href="https://glovoapp.com/docs/en/legal/privacy?country=es" target="_blank" rel="noreferrer">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="https://glovoapp.com/en/legal/cookies?country=es" target="_blank" rel="noreferrer">
              Cookies Policy
            </a>
          </Typography>
        </div>
      </div>

      <img className="status-bar" src={statusBar} alt="" />
      <div className="home-indicator" />
    </section>
  )
}
