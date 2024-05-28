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
  return (
    <TextContent>
      <ReviewSummary reviews={reviews} />
      {!isDesktop && <ReviewButton />}
      <h3>Reviews</h3>
      {reviews.map((review) => {
        const onReviewImageClick = (imageIndex) =>
          onImageClick(
            reviewsWithPhotos.findIndex((r) => r.id === review.id),
            imageIndex,
          )
        if (review.user_id === user?.id) {
          return (
            <Review
              key={review.id}
              review={review}
              onImageClick={onReviewImageClick}
              onEditClick={() =>
                history.push({
                  pathname: `/locations/${review.location_id}/edit-review/${review.id}`,
                  state: {
                    fromPage: history.location.pathname,
                  },
                })
              }
              editable
            />
          )
        } else {
          return (
            <Review
              key={review.id}
              review={review}
              onImageClick={onReviewImageClick}
            />
          )
        }
      })}
      {isDesktop && <ReviewForm onSubmit={onReviewSubmit} />}
    </TextContent>
  )
}

export default EntryReviews
