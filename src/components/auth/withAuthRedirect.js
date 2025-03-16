import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { pathWithCurrentView } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'

export const withAuthRedirect = (Component, withToast = true) => {
  const WithAuthRedirect = (props) => {
    const { t } = useTranslation()
    const { user, isLoading } = useSelector((state) => state.auth)
    const history = useAppHistory()
    const hasToasted = useRef(!withToast)
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const fromPage = params.get('fromPage')

    useEffect(() => {
      if (!isLoading && user) {
        if (!hasToasted.current) {
          toast.info(t('devise.failure.already_authenticated'))
          hasToasted.current = true
        }
        history.push(fromPage || pathWithCurrentView('/map'))
      }
    }, [isLoading, !!user]) //eslint-disable-line

    return <Component {...props} />
  }

  WithAuthRedirect.displayName = `WithAuthRedirect(${
    Component.displayName || Component.name || 'Component'
  })`

  return WithAuthRedirect
}
