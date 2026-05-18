import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { closeFilter } from '../../redux/filterSlice'
import { closeShare } from '../../redux/shareSlice'
import useLocationPane from '../entry/useLocationPane'

const ConnectTopPanel = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const isLocationsPath = location.pathname.startsWith('/locations')
  const { drawerFullyOpen } = useLocationPane()

  useEffect(
    () => () => {
      dispatch(closeFilter())
      dispatch(closeShare())
    },
    [dispatch],
  )

  useEffect(() => {
    if (isLocationsPath) {
      dispatch(closeFilter())
      dispatch(closeShare())
    }
  }, [dispatch, isLocationsPath])

  useEffect(() => {
    if (drawerFullyOpen) {
      dispatch(closeFilter())
      dispatch(closeShare())
    }
  }, [dispatch, drawerFullyOpen])

  return null
}

export default ConnectTopPanel
