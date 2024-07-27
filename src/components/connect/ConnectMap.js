import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useAppHistory } from '../../utils/useAppHistory'

const ConnectMap = ({ isListView }) => {
  const { googleMap } = useSelector((state) => state.map)
  const history = useAppHistory()
  const [wantedList, setWantedList] = useState(false)

  useEffect(() => {
    if (!googleMap && isListView) {
      setWantedList(true)
      history.push('/map')
    }
    if (googleMap && wantedList) {
      setWantedList(false)
      history.push('/list')
    }
  }, [googleMap, history, isListView, wantedList])

  return null
}

export default ConnectMap
