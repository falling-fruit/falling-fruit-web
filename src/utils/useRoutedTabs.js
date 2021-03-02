import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

/**
 * Hook to get and set the current tab, while updating the URL location on tab change.
 */
const useRoutedTabs = (tabPaths, defaultTabIndex = 0) => {
  const [tabIndex, setTabIndex] = useState(defaultTabIndex)
  const { pathname } = useLocation()
  const history = useHistory()

  // Set the initial tabIndex from the URL on page load
  useEffect(() => {
    const matchedIndex = tabPaths.indexOf(pathname)
    // eslint-disable-next-line no-magic-numbers
    if (matchedIndex !== -1) {
      setTabIndex(matchedIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTabChange = (tabIndex) => {
    setTabIndex(tabIndex)
    history.push(tabPaths[tabIndex])
  }

  return [tabIndex, handleTabChange]
}

export default useRoutedTabs
