import { useSelector } from 'react-redux'

import { locationToForm } from '../../utils/form'
import { LocationForm } from './LocationForm'

export const EditLocationForm = (props) => {
  const { location, isLoading } = useSelector((state) => state.location)
  const { typesAccess } = useSelector((state) => state.type)

  return isLoading || typesAccess.isEmpty ? (
    <div>Loading...</div>
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
