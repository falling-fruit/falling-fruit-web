import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useAppHistory } from '../../utils/useAppHistory'

const ConnectGoogleMap = ({ isTargetRoute, targetRoute }) => {
  const { googleMap, isLoading } = useSelector((state) => state.map)
  const history = useAppHistory()
  const [wantedTarget, setWantedTarget] = useState(false)

  useEffect(() => {
    if (!googleMap && isTargetRoute) {
      setWantedTarget(true)
      history.push('/map')
    }
    if (googleMap && wantedTarget && !isLoading) {
      setWantedTarget(false)
      history.push(targetRoute)
    }
  }, [googleMap, history, isTargetRoute, wantedTarget, isLoading, targetRoute])

  return null
}

export default ConnectGoogleMap
