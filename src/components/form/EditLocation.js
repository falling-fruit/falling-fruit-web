import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { locationToForm } from '../../utils/form'
import { LocationForm } from './LocationForm'

export const EditLocationForm = (props) => {
  const { t } = useTranslation()
  const { location, isLoading } = useSelector((state) => state.location)
  const { typesAccess } = useSelector((state) => state.type)

  return isLoading || typesAccess.isEmpty ? (
    <div>{t('layouts.loading')}</div>
  ) : (
    location && (
      <LocationForm
        initialValues={locationToForm(location, typesAccess)}
        editingId={location.id}
        {...props}
      />
    )
  )
}
