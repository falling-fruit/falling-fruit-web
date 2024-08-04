import { useHistory } from 'react-router-dom'

import { currentPathWithView, pathWithCurrentView } from './appUrl'

/**
 * Wraps useAppHistory from react-router-dom to automatically preserve
 * map state in URL.
 */
export const useAppHistory = () => {
  const history = useHistory()

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

  return { ...history, push: pushWithMapState, changeView }
}
