import { useTranslation } from 'react-i18next'

import Button from '../ui/Button'
import { ErrorPage } from '../ui/PageTemplate'

const NetworkErrorPage = () => {
  const { t } = useTranslation()

  return (
    <ErrorPage>
      <div className="grid">
        <h1>{t('pages.network_error.header_message')}</h1>
        <p>{t('pages.network_error.could_not_connect')}</p>
        <p>{t('pages.network_error.please_try_again')}</p>
        <div style={{ marginTop: '2rem' }}>
          <Button onClick={() => (window.location.href = '/')}>
            {t('form.button.reload')}
          </Button>
        </div>
      </div>
    </ErrorPage>
  )
}

export default NetworkErrorPage
