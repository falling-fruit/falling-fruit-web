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
        <p>{t('pages.network_error.you_are_offline')}</p>
        <p>{t('pages.network_error.please_check_your_connection')}</p>
        <RestartAndReloadButtons fromPage={fromPage} />
      </div>
    </ErrorPage>
  )
}

export default NetworkErrorPage
