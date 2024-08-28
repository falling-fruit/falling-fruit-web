import { useSelector } from 'react-redux'

import { locationToForm } from '../../utils/form'
import { Page } from '../entry/Entry'
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

export const EditLocationPage = () => (
  <Page>
    <h3 style={{ marginLeft: 10 }}>Editing Location</h3>
    <EditLocationForm />
  </Page>
)

export const NewLocationPage = () => (
  <Page>
    <h3 style={{ marginLeft: 10 }}>Adding Location</h3>
    <LocationForm />
  </Page>
)
