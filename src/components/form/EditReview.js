import { useSelector } from 'react-redux'

import { reviewToForm } from '../../utils/form'
import { Page } from '../entry/Entry'
import { ReviewForm } from './ReviewForm'

export const EditReviewForm = (props) => {
  const { review, isLoading } = useSelector((state) => state.review)

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    review && (
      <ReviewForm
        initialValues={{ review: reviewToForm(review) }}
        editingId={review.id}
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
