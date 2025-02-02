import { useHistory, useLocation } from 'react-router-dom'

import {
  currentPathWithView,
  pathWithCurrentView,
  withFromPage,
} from './appUrl'

/**
 * Wraps useAppHistory from react-router-dom to automatically preserve
 * map state in URL.
 */
export const useAppHistory = () => {
  const history = useHistory()
  const location = useLocation()

  const pushWithMapState = (to, state) => {
    let newTo
    if (typeof to === 'string') {
      newTo = pathWithCurrentView(to)
    } else {
      newTo = { ...to }
      if (to.pathname != null) {
        newTo.pathname = pathWithCurrentView(to.pathname)
      }
    }

    history.push(newTo, state)
  }
  const changeView = (newView, state) => {
    const newUrl = currentPathWithView(newView)
    history.push(newUrl, state)
  }

  const removeParam = (paramName) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.delete(paramName)
    const newSearch = searchParams.toString()
    const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`
    history.replace(newPath)
  }

  const pushWithFromPage = (path) => {
    history.push(withFromPage(path))
  }

  return {
    ...history,
    push: pushWithMapState,
    changeView,
    removeParam,
    pushWithFromPage,
  }
}
