import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useAppHistory } from '../../utils/useAppHistory'

const ConnectList = ({ isListRoute }) => {
  const { googleMap } = useSelector((state) => state.map)
  const history = useAppHistory()
  const [wantedList, setWantedList] = useState(false)

  useEffect(() => {
    if (!googleMap && isListRoute) {
      setWantedList(true)
      history.push('/map')
    }
    if (googleMap && wantedList) {
      setWantedList(false)
      history.push('/list')
    }
  }, [googleMap, history, isListRoute, wantedList])

  return null
}

export default ConnectList
