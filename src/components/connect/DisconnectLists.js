import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { clearLastViewedListId } from '../../redux/saveSlice'

const DisconnectLists = () => {
  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(clearLastViewedListId())
    },
    [dispatch],
  )

  return null
}

export default DisconnectLists
