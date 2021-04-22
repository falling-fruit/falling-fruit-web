import { createContext, useContext } from 'react'

import useRoutedTabs from '../../utils/useRoutedTabs'
import { PageTabs } from '../ui/PageTabs'

const TabsContext = createContext()

const RoutedPageTabs = ({ tabPaths, defaultTabIndex, children }) => {
  const routedTabs = useRoutedTabs(tabPaths, defaultTabIndex)
  const { tabIndex, handleTabChange } = routedTabs

  return (
    <TabsContext.Provider value={routedTabs}>
      <PageTabs index={tabIndex} onChange={handleTabChange}>
        {children}
      </PageTabs>
    </TabsContext.Provider>
  )
}

const useTabs = () => useContext(TabsContext)

export { RoutedPageTabs, useTabs }
