import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { clearLastViewedListPositionId } from '../../redux/listSlice'

const DisconnectLastViewedListPosition = () => {
  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(clearLastViewedListPositionId)
    },
    [dispatch],
  )

  return null
}

export default DisconnectLastViewedListPosition
