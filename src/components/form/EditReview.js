import { useSelector } from 'react-redux'

import { reviewToForm } from '../../utils/form'
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
