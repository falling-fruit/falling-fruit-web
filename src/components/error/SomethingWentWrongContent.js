import { useTranslation } from 'react-i18next'

import PageHeader from '../ui/PageHeader'
import { ErrorPage } from '../ui/PageTemplate'
import RestartAndReloadButtons from './RestartAndReloadButtons'

const SomethingWentWrongContent = ({ errorMessage, fromPage = '/' }) => {
  const { t } = useTranslation()

  const renderHTML = (html) => (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  )

  return (
    <ErrorPage>
      <div className="grid">
        <PageHeader>
          {t('pages.something_went_wrong.header_message')}
        </PageHeader>
        {errorMessage && (
          <p>
            {t('pages.something_went_wrong.error_occurred', {
              message: errorMessage,
            })}
          </p>
        )}
        <p>
          {renderHTML(
            t('pages.something_went_wrong.email_us_if_this_persists_html'),
          )}
        </p>
        <RestartAndReloadButtons fromPage={fromPage} />
      </div>
    </ErrorPage>
  )
}

export default SomethingWentWrongContent
