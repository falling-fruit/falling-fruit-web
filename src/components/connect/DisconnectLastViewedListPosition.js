import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { clearLastViewedListPositionId } from '../../redux/listSlice'

const DisconnectLastViewedListPosition = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const previousPath = useRef(location.pathname)

  useEffect(() => {
    previousPath.current = location.pathname
  }, [location.pathname])

  useEffect(
    () => () => {
      const currentPath = window.location.pathname
      const isLeavingContext =
        !currentPath.startsWith('/list') &&
        !currentPath.startsWith('/locations')

      if (isLeavingContext) {
        dispatch(clearLastViewedListPositionId())
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return null
}

export default DisconnectLastViewedListPosition
