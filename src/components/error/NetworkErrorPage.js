import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { ErrorPage } from '../ui/PageTemplate'
import RestartAndReloadButtons from './RestartAndReloadButtons'

const NetworkErrorPage = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const fromPage = location.state?.fromPage || '/'

  return (
    <ErrorPage>
      <div className="grid">
        <h1>{t('pages.network_error.header_message')}</h1>
        <p>{t('pages.network_error.could_not_connect')}</p>
        <p>{t('pages.network_error.please_try_again')}</p>
        <RestartAndReloadButtons fromPage={fromPage} />
      </div>
    </ErrorPage>
  )
}

export default NetworkErrorPage
