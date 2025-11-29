import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import Button from '../ui/Button'
import { ErrorPage } from '../ui/PageTemplate'

const SomethingWentWrongPage = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const renderHTML = (html) => (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  )

  const errorMessage = location.state?.errorMessage

  return (
    <ErrorPage>
      <div className="grid">
        <h1>{t('pages.something_went_wrong.header_message')}</h1>
        {errorMessage && (
          <p>
            {t('pages.something_went_wrong.error_occurred', {
              message: errorMessage,
            })}
          </p>
        )}
        <p>
          {renderHTML(
            t('pages.something_went_wrong.please_try_again_or_email_html'),
          )}
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Button onClick={() => (window.location.href = '/')}>
            {t('form.button.reload')}
          </Button>
        </div>
      </div>
    </ErrorPage>
  )
}

export default SomethingWentWrongPage
