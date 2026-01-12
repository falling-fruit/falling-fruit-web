import { useTranslation } from 'react-i18next'

import Button from '../ui/Button'

const ReloadButton = ({ fromPage = '/' }) => {
  const { t } = useTranslation()

  return (
    <div style={{ marginTop: '2rem' }}>
      <Button onClick={() => (window.location.href = fromPage)}>
        {t('form.button.reload')}
      </Button>
    </div>
  )
}

export default ReloadButton
