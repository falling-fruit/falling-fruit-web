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
  const { pathname, state } = useLocation()
  const history = useAppHistory()

  const [tabIndex, setTabIndex] = useState(defaultTabIndex)

  useEffect(() => {
    const matchedIndex = tabPaths.findIndex((tabNames) =>
      tabNames.some(
        (tabName) =>
          matchPath(pathname, {
            path: tabName,
            exact: false,
            strict: false,
          }) || tabName === state?.fromPage,
      ),
    )

    if (matchedIndex !== -1) {
      setTabIndex(matchedIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabPaths, defaultTabIndex, state?.fromPage])

  const handleTabChange = (tabIndex) => {
    if (
      // TODO: remove this edge case when refactoring Reach Tabs into NavLinks
      tabIndex === 0 &&
      pathname.includes('/entry') &&
      state?.fromPage === '/list'
    ) {
      history.push(pathname, { state: { fromPage: '/map' } })
    } else {
      history.push(tabPaths[tabIndex]?.[0])
    }
  }

  return [tabIndex, handleTabChange]
}

export default useRoutedTabs
