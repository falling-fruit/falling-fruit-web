import { useDispatch, useSelector } from 'react-redux'

import { openLightbox } from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { ReviewForm } from '../form/ReviewForm'
import { TextContent } from './EntryDesktop'
import Review from './Review'
import { ReviewButton } from './ReviewButton'
import ReviewSummary from './ReviewSummary'

const EntryReviews = () => {
  const isDesktop = useIsDesktop()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const reviews = useSelector((state) => state.location.reviews)

  const reviewsWithPhotos = reviews.filter((r) => r.photos.length > 0)

  const onImageClick = (reviewIndex, photoIndex) => {
    dispatch(openLightbox({ reviewIndex, photoIndex }))
  }
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
              onEditClick={() => history.push(`/reviews/${review.id}/edit`)}
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
      {isDesktop && <ReviewForm />}
    </TextContent>
  )
}

export default EntryReviews
