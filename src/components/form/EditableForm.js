import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getLocationById, getReviewById } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { Page } from '../entry/Entry'
import { LocationForm, locationToForm } from './LocationForm'
import { ReviewForm, reviewToForm } from './ReviewForm'

const EditableForm = ({
  Form,
  entityName,
  editingId,
  getFormData,
  convertFormData,
  getRedirectLink,
  ...props
}) => {
  const history = useAppHistory()

  const [formData, setFormData] = useState(null)

  useEffect(() => {
    const loadReview = async () => {
      try {
        const formData = await getFormData(editingId)
        setFormData(formData)
      } catch (error) {
        toast.error(`${entityName} #${editingId} not found`)
      }
      setFormData(await getFormData(editingId))
    }

    loadReview()
  }, [entityName, editingId, getFormData])

  return (
    formData && (
      <Form
        initialValues={convertFormData(formData)}
        editingId={editingId}
        onSubmit={() => history.push(getRedirectLink(formData))}
        {...props}
      />
    )
  )
}

export const EditReviewForm = (props) => {
  const { reviewId } = useParams()
  return (
    <EditableForm
      Form={ReviewForm}
      entityName="Review"
      editingId={reviewId}
      getFormData={getReviewById}
      convertFormData={(review) => ({
        review: reviewToForm(review),
      })}
      getRedirectLink={(review) => `/locations/${review.location_id}`}
      {...props}
    />
  )
}

export const EditReviewPage = () => (
  <Page>
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <h3>Editing My Review</h3>
      <EditReviewForm />
    </div>
  </Page>
)

export const EditLocationForm = (props) => {
  const { locationId } = useParams()
  return (
    <EditableForm
      Form={LocationForm}
      entityName="Location"
      editingId={locationId}
      getFormData={getLocationById}
      convertFormData={locationToForm}
      getRedirectLink={(location) => `/locations/${location.id}`}
      {...props}
    />
  )
}

export const EditLocationPage = () => (
  <Page>
    <h3 style={{ marginLeft: 10 }}>Editing Location</h3>
    <EditLocationForm />
  </Page>
)
