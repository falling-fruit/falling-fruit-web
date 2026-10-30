import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLast24hLocationChanges } from '../../redux/activitySlice'

const ConnectWelcomeData = () => {
  const { i18n } = useTranslation()
  const language = i18n.language
  const dispatch = useDispatch()
  const { typesAccess } = useSelector((state) => state.type)

  const typesReady = !typesAccess.isEmpty

  useEffect(() => {
    if (typesReady) {
      dispatch(fetchLast24hLocationChanges())
    }
  }, [dispatch, typesReady, language])

  return null
}

export default ConnectWelcomeData
