import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { closeFilter } from '../../redux/filterSlice'
import { closeShare } from '../../redux/shareSlice'

const ConnectTopPanel = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const isLocationsPath = location.pathname.startsWith('/locations')
  const drawerFullyOpen = useSelector(
    (state) => state.location.pane.drawerFullyOpen,
  )

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
