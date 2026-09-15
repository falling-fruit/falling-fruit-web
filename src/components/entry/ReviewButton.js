import { Star } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useAppHistory } from '../../utils/useAppHistory'
import Button from '../ui/Button'
import useLocationPane from './useLocationPane'

export const ReviewButton = (props) => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const { locationId } = useParams()
  const { fullyOpenPaneDrawerIfMobile } = useLocationPane()

  return (
    <Button
      leftIcon={<Star />}
      onClick={() => {
        // On mobile, open the drawer first so returning from the review form
        // (which pushes back to /locations/:id) lands on the full drawer
        // rather than the half-open sheet.
        fullyOpenPaneDrawerIfMobile()
        history.push(`/locations/${locationId}/review`)
      }}
      {...props}
    >
      {t('form.button.review')}
    </Button>
  )
}
