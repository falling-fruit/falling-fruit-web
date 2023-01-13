import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getLocationById, getReviewById } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { Page } from '../entry/Entry'
import { LocationForm, locationToForm } from './LocationForm'
import { ReviewForm, reviewToForm } from './ReviewForm'

const EditableForm = ({
  Form,
  getFormData,
  convertFormData,
  getRedirectLink,
  ...props
}) => {
  const { id } = useParams()
  const history = useAppHistory()

  const [formData, setFormData] = useState(null)

  useEffect(() => {
    const loadReview = async () => {
      setFormData(await getFormData(id))
    }

    loadReview()
  }, [id, getFormData])

  return (
    formData && (
      <Form
        initialValues={convertFormData(formData)}
        editingId={id}
        onSubmit={() => history.push(getRedirectLink(formData))}
        {...props}
      />
    )
  )
}

export const EditReviewForm = (props) => (
  <EditableForm
    Form={ReviewForm}
    getFormData={getReviewById}
    convertFormData={(review) => ({
      review: reviewToForm(review),
    })}
    getRedirectLink={(review) => `/locations/${review.location_id}`}
    {...props}
  />
)

export const EditReviewPage = () => (
  <Page>
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <h3>Editing My Review</h3>
      <EditReviewForm />
    </div>
  </Page>
)

export const EditLocationForm = (props) => (
  <EditableForm
    Form={LocationForm}
    getFormData={getLocationById}
    convertFormData={locationToForm}
    getRedirectLink={(location) => `/locations/${location.id}`}
    {...props}
  />
)

export const EditLocationPage = () => (
  <Page>
    <h3 style={{ marginLeft: 10 }}>Editing Location</h3>
    <EditLocationForm />
  </Page>
)
