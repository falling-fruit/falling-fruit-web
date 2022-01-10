import { useHistory } from 'react-router-dom'

import { getPathWithMapState } from './getInitialUrl'

/**
 * Wraps useAppHistory from react-router-dom to automatically preserve
 * map state in URL.
 */
export const useAppHistory = () => {
  const history = useHistory()

  const pushWithMapState = (to, state) => {
    let newTo
    if (typeof to === 'string') {
      newTo = getPathWithMapState(to)
    } else {
      newTo = { ...to }
      if (to.pathname != null) {
        newTo.pathname = getPathWithMapState(to.pathname)
      }
    }

    history.push(newTo, state)
  }

  return { ...history, push: pushWithMapState }
}

// TODO: create a history listener/context for consistent back navigation?
// https://stackoverflow.com/a/67477708/2411756
