import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { setView } from '../../redux/mapSlice'
import { getViewCoordsFromUrl } from '../../utils/getInitialUrl'

const ConnectView = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    const [_isValid, viewCoords] = getViewCoordsFromUrl()
    dispatch(setView(viewCoords))
  }, [dispatch, location.pathname])

  return null
}

export default ConnectView
