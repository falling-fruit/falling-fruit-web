import { useTranslation } from 'react-i18next'

import { useAppSelector } from '../../redux/hooks'
import InaturalistReviews from './InaturalistReviews'
import ReviewForm from './ReviewForm'
import ReviewList from './ReviewList'

const ReviewsTab = () => {
  const { t } = useTranslation()
  const { reviews } = useAppSelector((state) => state.location)
  const hasReviews = reviews && reviews.length > 0

  return (
    <div>
      {hasReviews && (
        <>
          <h2>{t('glossary.reviews')}</h2>
          <ReviewList reviews={reviews} />
        </>
      )}
      <InaturalistReviews />
      <ReviewForm />
    </div>
  )
}

export default ReviewsTab
