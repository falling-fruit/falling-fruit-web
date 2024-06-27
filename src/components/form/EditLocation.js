import { useSelector } from 'react-redux'

import { useAppHistory } from '../../utils/useAppHistory'
import { Page } from '../entry/Entry'
import { LocationForm, locationToForm } from './LocationForm'

export const EditLocationForm = (props) => {
  const history = useAppHistory()
  const { location, isLoading } = useSelector((state) => state.location)

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    location && (
      <LocationForm
        initialValues={locationToForm(location)}
        editingId={location.id}
        onSubmit={() => history.push(`/locations/${location.id}`)}
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
