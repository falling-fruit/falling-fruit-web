import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setInitialView } from '../../redux/mapSlice'
import { parseCurrentUrl } from '../../utils/appUrl'
import ConnectPath from './ConnectPath'

const DEFAULT_LAT = 40.1125785
const DEFAULT_LNG = -88.2287926
const DEFAULT_ZOOM = 4

const ConnectMap = () => {
  const dispatch = useDispatch()
  const { initialView } = useSelector((state) => state.map)
  const hasInitialView = !!initialView
  const parsedUrl = parseCurrentUrl()
  const view = parsedUrl.view || {
    center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
    zoom: DEFAULT_ZOOM,
  }

  useEffect(() => {
    if (!hasInitialView) {
      dispatch(setInitialView(view))
    }
  }, [dispatch, hasInitialView]) //eslint-disable-line

  return <ConnectPath />
}

export default ConnectMap
