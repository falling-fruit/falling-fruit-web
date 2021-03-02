import { useEffect, useState } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'

import EntryDetails from '../entry/EntryDetails'
import { PageTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import { DEFAULT_TAB, TABS } from './tabs'
import TopBarSwitch from './TopBarSwitch'

/**
 * Hook to get and set the current tab, while updating the URL location on tab change.
 */
const useRoutedTabs = (defaultTab, tabs) => {
  const [tabIndex, setTabIndex] = useState(defaultTab)
  const { pathname } = useLocation()
  const history = useHistory()

  // Set the initial tabIndex from the URL on page load
  useEffect(() => {
    const matchedIndex = tabs.findIndex(({ path }) => path === pathname)
    // eslint-disable-next-line no-magic-numbers
    if (matchedIndex !== -1) {
      setTabIndex(matchedIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTabChange = (tabIndex) => {
    setTabIndex(tabIndex)
    history.push(tabs[tabIndex].path)
  }

  return [tabIndex, handleTabChange]
}

const MobileLayout = () => {
  const [tabIndex, handleTabChange] = useRoutedTabs(DEFAULT_TAB, TABS)

  const tabPanels = TABS.map(({ path, panel }) => (
    <TabPanel key={path}>{panel}</TabPanel>
  ))
  const tabList = TABS.map(({ path, icon, label }) => (
    <Tab key={path} to={path}>
      {icon}
      {label}
    </Tab>
  ))

  return (
    <PageTabs index={tabIndex} onChange={handleTabChange}>
      <TabPanels>
        <TopBarSwitch />
        <Switch>
          <Route path="/entry/:id">
            <EntryDetails />
          </Route>
          <Route>{tabPanels}</Route>
        </Switch>
      </TabPanels>
      <TabList>{tabList}</TabList>
    </PageTabs>
  )
}

export default MobileLayout
