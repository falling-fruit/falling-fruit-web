import { Star } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useAppHistory } from '../../utils/useAppHistory'
import Button from '../ui/Button'

export const ReviewButton = (props) => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const { locationId } = useParams()

  return (
    <Button
      leftIcon={<Star />}
      onClick={() => {
        history.push(`/locations/${locationId}/review`)
      }}
      {...props}
    >
      {t('form.button.review')}
    </Button>
  )
}
