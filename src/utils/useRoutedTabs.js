import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

/**
 * Hook to get and set the current tab, while updating the URL location on tab change.
 */
const useRoutedTabs = (tabPaths, defaultTabIndex = 0) => {
  const { pathname } = useLocation()
  const history = useHistory()
  const [tabIndex, setTabIndex] = useState(() => {
    // Set the initial tabIndex from the URL on page load
    const matchedIndex = tabPaths.indexOf(pathname)
    return matchedIndex === -1 ? defaultTabIndex : matchedIndex
  })

  const handleTabChange = (tabIndex) => {
    setTabIndex(tabIndex)
    history.push(tabPaths[tabIndex])
  }

  return [tabIndex, handleTabChange]
}

export default useRoutedTabs
