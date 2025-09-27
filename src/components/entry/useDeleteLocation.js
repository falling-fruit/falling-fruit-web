import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { deleteExistingLocation } from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'

export const useDeleteLocation = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useAppHistory()
  const user = useSelector((state) => state.auth.user)
  const { location: locationData, reviews } = useSelector(
    (state) => state.location,
  )

  const handleDeleteLocation = (locationId) => {
    if (confirm(t('confirm_message.delete_location'))) {
      dispatch(deleteExistingLocation(locationId)).then((result) => {
        if (result.type.endsWith('/fulfilled')) {
          history.push('/map')
          toast.success(t('success_message.location_deleted'))
        } else if (result.type.endsWith('/rejected')) {
          toast.error(
            t('error_message.api.location_deletion_failed', {
              message: result.error.message || t('error_message.unknown_error'),
            }),
          )
        }
      })
    }
  }

  const handleDeleteDisabledClick = () => {
    toast.info(t('info_message.cannot_delete_location_with_other_reviews'))
  }

  const isDeleteVisible = locationData?.user_id === user?.id
  const isDeleteDisabled =
    reviews?.some((review) => review.user_id !== user?.id) || false

  const handleClickDelete = (locationId) => {
    if (isDeleteDisabled) {
      handleDeleteDisabledClick()
    } else {
      handleDeleteLocation(locationId)
    }
  }

  return {
    handleDeleteLocation,
    handleDeleteDisabledClick,
    handleClickDelete,
    isDeleteVisible,
    isDeleteDisabled,
  }
}
