import { useSelector } from 'react-redux'

import { ReviewForm } from '../form/ReviewForm'
import { TextContent } from './Entry'
import Review from './Review'

const EntryReviews = ({ reviews, onImageClick, onReviewSubmit }) => {
  const { user } = useSelector((state) => state.auth)

  const userReviewIdx = reviews.findIndex(
    (review) => review.user_id === user?.id,
  )

  let userReview
  if (userReviewIdx !== -1) {
    userReview = reviews.splice(userReviewIdx, 1)
  }

  return (
    <TextContent>
      <h2>Reviews{reviews && ` (${reviews.length})`}</h2>
      {userReview && <Review review={userReview} />}
      {reviews.map((review, index) => (
        <Review
          key={index}
          review={review}
          onImageClick={(imageIndex) => onImageClick(index, imageIndex)}
        />
      ))}
      <ReviewForm onSubmit={onReviewSubmit} />
    </TextContent>
  )
}

export default EntryReviews
