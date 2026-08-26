import { useTranslation } from 'react-i18next'

import Button from './Button'

const SubmitButton = ({ isSubmitting, disabled, label, ...props }) => {
  const { t } = useTranslation()

  return (
    <Button type="submit" disabled={disabled || isSubmitting} {...props}>
      {isSubmitting
        ? t('form.button.submitting')
        : label || t('form.button.submit')}
    </Button>
  )
}

export default SubmitButton
