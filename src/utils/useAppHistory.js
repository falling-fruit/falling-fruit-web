import { useHistory, useLocation } from 'react-router-dom'

import {
  currentPathWithView,
  pathToSignInPage,
  pathWithCurrentView,
  pathWithView,
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
  const replaceWithMapState = (to) => {
    history.replace(pathWithCurrentView(to))
  }

  const changeView = (newView, state) => {
    const newUrl = currentPathWithView(newView)
    history.push(newUrl, state)
  }

  const replaceView = (newView, state) => {
    const newUrl = currentPathWithView(newView)
    history.replace(newUrl, state)
  }

  const removeParam = (paramName) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.delete(paramName)
    const newSearch = searchParams.toString()
    const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`
    history.replace(newPath)
  }

  const pushToSignInPage = () => {
    history.push(pathToSignInPage())
  }

  const pushAndChangeView = (path, view, state) => {
    const newUrl = pathWithView(path, view)
    history.push(newUrl, state)
  }

  return {
    ...history,
    push: pushWithMapState,
    replace: replaceWithMapState,
    changeView,
    replaceView,
    removeParam,
    pushToSignInPage,
    pushAndChangeView,
  }
}
