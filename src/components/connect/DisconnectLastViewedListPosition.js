import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { clearLastViewedListPositionState } from '../../redux/listSlice'

const DisconnectLastViewedListPosition = () => {
  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(clearLastViewedListPositionState())
    },
    [dispatch],
  )

  return null
}

export default DisconnectLastViewedListPosition
