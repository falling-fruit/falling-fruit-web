import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { updatePosition } from '../../redux/locationSlice'
import { isTooClose } from '../../utils/form'
import { useAppHistory } from '../../utils/useAppHistory'
import PositionPickerNav from './PositionPickerNav'

const InitLocationNav = () => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const { locations } = useSelector((state) => state.map)
  const { form, locationId, position } = useSelector((state) => state.location)

  const editingId = locationId === 'new' ? undefined : locationId

  const isAdjustingFromForm = !!form

  const tooClose = position ? isTooClose(position, locations, editingId) : false

  const handleConfirm = () => {
    if (tooClose) {
      toast.warning(t('locations.init.position_too_close'))
    } else {
      history.push('/locations/new')
    }
  }

  const handleCancel = () => {
    if (isAdjustingFromForm) {
      if (form?.position) {
        dispatch(updatePosition(form.position))
      }
      history.push('/locations/new')
    } else {
      history.push('/map')
    }
  }

  return (
    <PositionPickerNav
      instructions={
        isAdjustingFromForm
          ? t('locations.init.edit_instructions')
          : t('locations.init.choose_instructions')
      }
      cancelLabel={t('locations.init.cancel')}
      confirmLabel={t('locations.init.confirm')}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      tooClose={tooClose}
    />
  )
}

export default InitLocationNav
