import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getLocationById } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { Page } from '../entry/Entry'
import { LocationForm, locationToForm } from './LocationForm'

export const EditLocationForm = (props) => {
  const { locationId } = useParams()
  const history = useAppHistory()
  const [location, setLocation] = useState(null)

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const location = await getLocationById(locationId)
        setLocation(location)
      } catch (error) {
        toast.error(`Location #${locationId} not found`)
      }
    }

    loadFormData()
  }, [locationId])

  const handleSubmit = () => {
    if (location) {
      history.push(`/locations/${location.id}`)
    }
  }

  return (
    location && (
      <LocationForm
        initialValues={locationToForm(location)}
        editingId={locationId}
        onSubmit={handleSubmit}
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
