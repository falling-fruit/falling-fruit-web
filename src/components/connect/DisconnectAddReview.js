import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearReview } from '../../redux/reviewSlice'

const DisconnectAddReview = () => {
  const dispatch = useDispatch()
  const { review, form } = useSelector((state) => state.review)

  const hasNewReviewForm = !!form && !review

  useEffect(
    () => () => {
      if (hasNewReviewForm) {
        dispatch(clearReview())
      }
    },
    [dispatch, hasNewReviewForm],
  )

  return null
}

export default DisconnectAddReview
