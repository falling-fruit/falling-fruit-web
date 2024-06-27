import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchReviewData } from '../../redux/reviewSlice'

const ConnectReview = ({reviewId}) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchReviewData(reviewId))
  }, [dispatch, reviewId])

  return null
}

export default ConnectReview
