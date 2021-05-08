import { useState } from 'react'
import { matchPath, useHistory, useLocation } from 'react-router-dom'

/**
 * Hook to get and set the current tab, while updating the URL location on tab change.
 */
const useRoutedTabs = (tabPaths, defaultTabIndex = 0) => {
  const { pathname } = useLocation()
  const history = useHistory()

  const [tabIndex, setTabIndex] = useState(() => {
    // Set the initial tabIndex from the URL on page load
    const matchedIndex = tabPaths.findIndex((tabName) =>
      matchPath(pathname, {
        path: tabName,
        exact: false,
        strict: false,
      }),
    )
    return matchedIndex === -1 ? defaultTabIndex : matchedIndex
  })

  const handleTabChange = (tabIndex) => {
    setTabIndex(tabIndex)

    // on shallow match return to shallow root
    if (
      matchPath(pathname, {
        path: tabPaths[tabIndex],
        exact: false,
        strict: false,
      })
    ) {
      history.push(tabPaths[tabIndex])
    } else {
      // otherwise push new shallow while keeping deep link
      const segments = pathname.split('/')
      history.push([tabPaths[tabIndex], ...segments.splice(2)].join('/'))
    }
  }

  return [tabIndex, handleTabChange]
}

export default useRoutedTabs
