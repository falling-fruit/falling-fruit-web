import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { openLightbox } from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { ReviewForm } from '../form/ReviewForm'
import Review from './Review'
import { ReviewButton } from './ReviewButton'

const EntryReviews = () => {
  const isDesktop = useIsDesktop()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const user = useSelector((state) => state.auth.user)
  const reviews = useSelector((state) => state.location.reviews)

  const reviewsWithPhotos = reviews.filter((r) => r.photos.length > 0)

  const onImageClick = (reviewIndex, photoIndex) => {
    dispatch(openLightbox({ reviewIndex, photoIndex }))
  }
  return (
    <>
      {!isDesktop && <ReviewButton />}
      <h3>{t('glossary.review.other')}</h3>
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
    </>
  )
}

export default EntryReviews
