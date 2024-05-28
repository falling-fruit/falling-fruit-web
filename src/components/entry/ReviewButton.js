import { Star } from '@styled-icons/boxicons-solid'
import { useParams } from 'react-router-dom'

import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import Button from '../ui/Button'

export const ReviewButton = (props) => {
  const history = useAppHistory()
  const { locationId } = useParams()
  const isDesktop = useIsDesktop()

  return (
    <Button
      leftIcon={<Star />}
      onClick={() => {
        if (isDesktop) {
          window.location.hash = ''
          window.location.hash = 'review'
        } else {
          history.push(`/locations/${locationId}/review`)
        }
      }}
      {...props}
    >
      Review
    </Button>
  )
}
