import { useTranslation } from 'react-i18next'

import { ErrorPage } from '../ui/PageTemplate'
import ReloadButton from './ReloadButton'

const SomethingWentWrongContent = ({ errorMessage, fromPage = '/' }) => {
  const { t } = useTranslation()

  const renderHTML = (html) => (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  )

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
        <ReloadButton fromPage={fromPage} />
      </div>
    </ErrorPage>
  )
}

export default SomethingWentWrongContent
