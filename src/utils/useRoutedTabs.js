import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

/**
 * Hook to get and set the current tab, while updating the URL location on tab change.
 */
const useRoutedTabs = (tabPaths, defaultTabIndex = 0) => {
  const { pathname } = useLocation()
  const history = useHistory()

  // get breadcrumbs
  const segments = pathname.split('/')

  const [tabIndex, setTabIndex] = useState(() => {
    // Set the initial tabIndex from the URL on page load
    const matchedIndex = tabPaths.findIndex((tabName) =>
      pathname.includes(tabName),
    )
    return matchedIndex === -1 ? defaultTabIndex : matchedIndex
  })

  const handleTabChange = (tabIndex) => {
    setTabIndex(tabIndex)

    // on shallow match return to shallow root
    if (segments[1] === tabPaths[tabIndex].slice(1)) {
      history.push(tabPaths[tabIndex])
    } else {
      // otherwise push new shallow while keeping deep link
      history.push([tabPaths[tabIndex], ...segments.splice(2)].join('/'))
    }
  }

  return [tabIndex, handleTabChange]
}

export default useRoutedTabs
