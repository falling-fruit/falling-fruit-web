import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { updatePosition } from '../../redux/locationSlice'
import { isTooClose } from '../../utils/form'
import { useAppHistory } from '../../utils/useAppHistory'
import PositionPickerNav from './PositionPickerNav'

const EditLocationPositionNav = () => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const { locationId } = useParams()
  const { locations } = useSelector((state) => state.map)
  const {
    position: storedPosition,
    location,
    form,
  } = useSelector((state) => state.location)

  const editingId = Number(locationId)
  const tooClose =
    storedPosition && isTooClose(storedPosition, locations, editingId)

  const handleCancel = () => {
    // Revert to the position the user last set in the form
    const revertPosition =
      form?.position || (location && { lat: location.lat, lng: location.lng })
    if (revertPosition) {
      dispatch(updatePosition(revertPosition))
    }
    history.push(`/locations/${locationId}/edit`)
  }

  const handleConfirm = () => {
    if (tooClose) {
      toast.warning(t('locations.init.position_too_close'))
    } else {
      // storedPosition already reflects the draggable marker's position via redux
      history.push(`/locations/${locationId}/edit`)
    }
  }

  return (
    <PositionPickerNav
      instructions={t('locations.edit_position.instructions')}
      cancelLabel={t('locations.edit_position.cancel')}
      confirmLabel={t('locations.edit_position.confirm')}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      tooClose={tooClose}
    />
  )
}

export default EditLocationPositionNav
