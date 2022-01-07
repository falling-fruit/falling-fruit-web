import { useSelector } from 'react-redux'

import { useAppHistory } from '../../utils/useAppHistory'
import { ReviewForm } from '../form/ReviewForm'
import { TextContent } from './Entry'
import Review from './Review'
import ReviewSummary from './ReviewSummary'

const EntryReviews = ({ reviews, onImageClick, onReviewSubmit }) => {
  const history = useAppHistory()
  const user = useSelector((state) => state.auth.user)

  const indexedReviews = reviews.map((review, index) => ({ ...review, index }))

  const userReviews = indexedReviews.filter(
    (review) => review.user_id === user?.id,
  )
  const otherReviews = indexedReviews.filter(
    (review) => review.user_id !== user?.id,
  )

  return (
    <TextContent>
      <ReviewSummary reviews={reviews} />
      {userReviews.map((review) => (
        <Review
          key={review.id}
          review={review}
          onImageClick={(imageIndex) => onImageClick(review.index, imageIndex)}
          onEditClick={() =>
            history.push({
              pathname: `/review/${review.id}/edit`,
              state: {
                fromPage: history.location.pathname,
              },
            })
          }
          editable
        />
      ))}
      {otherReviews.map((review) => (
        <Review
          key={review.id}
          review={review}
          onImageClick={(imageIndex) => onImageClick(review.index, imageIndex)}
        />
      ))}
      <ReviewForm onSubmit={onReviewSubmit} />
    </TextContent>
  )
}

export default EntryReviews
