import { useEffect, useState } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

import { useAppHistory } from './useAppHistory'

/**
 * Hook to get and set the current tab, while updating the URL location on tab change.
 * Notice that the router/pathname "owns" the currently selected tab. When the pathname changes,
 * the tab index in the tabs component is synced to it. This is so that we can control the
 * current tab panel via the URL, anywhere throughout the app.
 */
const useRoutedTabs = (tabPaths, defaultTabIndex = 0) => {
  const { pathname } = useLocation()
  const history = useAppHistory()

  const [tabIndex, setTabIndex] = useState(defaultTabIndex)

  useEffect(() => {
    const matchedIndex = tabPaths.findIndex((tabName) =>
      matchPath(pathname, {
        path: tabName,
        exact: false,
        strict: false,
      }),
    )

    if (matchedIndex !== -1) {
      setTabIndex(matchedIndex)
    }
  }, [pathname, tabPaths, defaultTabIndex])

  const handleTabChange = (tabIndex) => {
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
