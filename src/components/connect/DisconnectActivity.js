import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { resetUserActivityLastBrowsedSection } from '../../redux/activitySlice'

const DisconnectActivity = () => {
  const dispatch = useDispatch()
  const { userActivityLastBrowsedSection } = useSelector(
    (state) => state.activity,
  )
  const hasSectionId = !!userActivityLastBrowsedSection.id

  useEffect(
    () => () => {
      if (hasSectionId) {
        dispatch(resetUserActivityLastBrowsedSection())
      }
    },
    [dispatch, hasSectionId],
  )

  return null
}

export default DisconnectActivity
