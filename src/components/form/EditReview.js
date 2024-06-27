import { useSelector } from 'react-redux'

import { useAppHistory } from '../../utils/useAppHistory'
import { Page } from '../entry/Entry'
import { ReviewForm, reviewToForm } from './ReviewForm'

export const EditReviewForm = (props) => {
  const history = useAppHistory()
  const { review, isLoading } = useSelector((state) => state.review)

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    review && (
      <ReviewForm
        initialValues={{ review: reviewToForm(review) }}
        editingId={review.id}
        onSubmit={() => history.push(`/locations/${review.location_id}`)}
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
