import { ReviewForm } from '../form/ReviewForm'
import { TextContent } from './Entry'
import Review from './Review'

const EntryReviews = ({ reviews, onImageClick, onReviewSubmit }) => (
  <TextContent>
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

export default EntryReviews
