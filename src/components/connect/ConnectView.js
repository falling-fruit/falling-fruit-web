import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { setView } from '../../redux/mapSlice'
import { parseUrl } from '../../utils/getInitialUrl'

const ConnectView = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    const { center, zoom } = parseUrl()
    dispatch(setView({ center, zoom }))
  }, [dispatch, location.pathname])

  return null
}

export default ConnectView
