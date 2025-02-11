import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { reviewToForm } from '../../utils/form'
import { ReviewForm } from './ReviewForm'

export const EditReviewForm = (props) => {
  const { t } = useTranslation()
  const { review, isLoading } = useSelector((state) => state.review)

  return isLoading ? (
    <div>{t('layouts.loading')}</div>
  ) : (
    review && (
      <ReviewForm
        initialValues={{ review: reviewToForm(review) }}
        editingId={review.id}
        {...props}
      />
    )
  )
}
