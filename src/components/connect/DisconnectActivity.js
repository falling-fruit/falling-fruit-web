import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { resetUserActivityLastBrowsedSection } from '../../redux/activitySlice'

const DisconnectActivity = () => {
  const dispatch = useDispatch()
  const { userActivityLastBrowsedSection } = useSelector(
    (state) => state.activity,
  )

  useEffect(
    () => () => {
      if (userActivityLastBrowsedSection.id) {
        dispatch(resetUserActivityLastBrowsedSection())
      }
    },
    [dispatch],
  )

  return null
}

export default DisconnectActivity
