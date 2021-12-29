import { useSelector } from 'react-redux'

import { ReviewForm } from '../form/ReviewForm'
import { TextContent } from './Entry'
import Review from './Review'
import ReviewSummary from './ReviewSummary'

const EntryReviews = ({ reviews, onImageClick, onReviewSubmit }) => {
  const { user } = useSelector((state) => state.auth)

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
