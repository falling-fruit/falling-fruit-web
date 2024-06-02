import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { rememberLocationIdForReviewId } from '../../redux/miscSlice'
import { getReviewById } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { Page } from '../entry/Entry'
import { ReviewForm, reviewToForm } from './ReviewForm'

export const EditReviewForm = (props) => {
  const { reviewId } = useParams()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const [review, setReview] = useState(null)

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const review = await getReviewById(reviewId)
        dispatch(
          rememberLocationIdForReviewId({
            reviewId,
            locationId: review.location_id,
          }),
        )
        setReview(review)
      } catch (error) {
        toast.error(`Review #${reviewId} not found`)
      }
    }

    loadFormData()
  }, [reviewId, dispatch])

  const afterSubmit = () => {
    if (review) {
      history.push(`/locations/${review.location_id}`)
    }
  }
  return (
    review && (
      <ReviewForm
        initialValues={{ review: reviewToForm(review) }}
        editingId={reviewId}
        onSubmit={afterSubmit}
        {...props}
      />
    )
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
