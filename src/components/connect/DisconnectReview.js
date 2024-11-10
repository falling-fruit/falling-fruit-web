import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearReview } from '../../redux/reviewSlice'

const DisconnectReview = () => {
  const dispatch = useDispatch()
  const { review } = useSelector((state) => state.review)

  useEffect(() => {
    if (review) {
      dispatch(clearReview())
    }
  }, [dispatch, review?.id]) //eslint-disable-line

  return null
}

export default DisconnectReview
