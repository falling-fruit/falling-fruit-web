import { ReviewForm } from '../form/ReviewForm'
import { TextContent } from './Entry'
import Review from './Review'

const EntryReviews = ({ reviews }) => (
  <TextContent>
    <h2>Reviews{reviews && ` (${reviews.length})`}</h2>
    {reviews.map((review, index) => (
      <Review key={index} review={review} />
    ))}
    <ReviewForm />
  </TextContent>
)

export default EntryReviews
