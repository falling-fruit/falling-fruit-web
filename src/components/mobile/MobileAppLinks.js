import { Capacitor } from '@capacitor/core'
import { useTranslation } from 'react-i18next'

const MobileAppLinks = () => {
  const { t } = useTranslation()

  if (Capacitor.isNativePlatform()) {
    return null
  }

  return (
    <>
      <div>
        <a
          href="https://itunes.apple.com/us/app/falling-fruit/id380859409"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('pages.welcome.falling_fruit_app_for_ios')}
        </a>
        <div></div>
        <a
          href="https://play.google.com/store/apps/details?id=uh.fallingfruit.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('pages.welcome.falling_fruit_app_for_android')}
        </a>
      </div>
      <br />
    </>
  )
}

export default MobileAppLinks
