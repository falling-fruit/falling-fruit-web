import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { fetchAndLocalizeTypes } from '../../redux/typeSlice'

const ConnectTypes = () => {
  const { i18n } = useTranslation()
  const language = i18n.language
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAndLocalizeTypes(language))
  }, [dispatch, language])

  return null
}
export default ConnectTypes
