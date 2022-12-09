import { partition } from 'ramda'
import { useSelector } from 'react-redux'

import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { ReviewForm } from '../form/ReviewForm'
import { TextContent } from './Entry'
import Review from './Review'
import { ReviewButton } from './ReviewButton'
import ReviewSummary from './ReviewSummary'

const EntryReviews = ({ reviews, onImageClick, onReviewSubmit }) => {
  const isDesktop = useIsDesktop()
  const history = useAppHistory()
  const user = useSelector((state) => state.auth.user)

  const reviewsWithPhotos = reviews.filter((r) => r.photos.length > 0)
  const [userReviews, otherReviews] = partition(
    (review) => review.user_id === user?.id,
    reviews,
  )

  return (
    <TextContent>
      <ReviewSummary reviews={reviews} />
      {!isDesktop && <ReviewButton />}
      <h3>Reviews</h3>
      {userReviews.map((review) => (
        <Review
          key={review.id}
          review={review}
          onImageClick={(imageIndex) =>
            onImageClick(
              reviewsWithPhotos.findIndex((r) => r.id === review.id),
              imageIndex,
            )
          }
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
          onImageClick={(imageIndex) =>
            onImageClick(
              reviewsWithPhotos.findIndex((r) => r.id === review.id),
              imageIndex,
            )
          }
        />
      ))}
      {isDesktop && <ReviewForm onSubmit={onReviewSubmit} />}
    </TextContent>
  )
}

export default EntryReviews
