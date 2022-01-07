import { getPathWithMapState } from './getInitialUrl'

/**
 * Wraps useAppHistory from react-router-dom to automatically preserve
 * map state in URL.
 */
export const useAppHistory = () => {
  const history = useAppHistory()

  const pushWithMapState = (to, state) => {
    let newTo
    if (typeof to === 'string') {
      newTo = getPathWithMapState(newTo)
    } else {
      newTo = { ...to }
      if (to.pathname != null) {
        newTo.pathname = getPathWithMapState(to.pathname)
      }
    }

    history.push(newTo, state)
  }

  history.push = pushWithMapState

  return history
}

// TODO: create a history listener/context for consistent back navigation?
// https://stackoverflow.com/a/67477708/2411756
