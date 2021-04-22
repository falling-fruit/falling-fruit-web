import { Route, Switch } from 'react-router-dom'

import EntryDetails from '../entry/EntryDetails'
import { Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import { RoutedPageTabs } from './RoutedPageTabs'
import { DEFAULT_TAB, TABS } from './tabs'
import TopBarSwitch from './TopBarSwitch'

const MobileLayout = () => {
  const tabPanels = TABS.map(({ path, panel }) => (
    <TabPanel key={path}>{panel}</TabPanel>
  ))

  const tabList = TABS.map(({ path, icon, label }) => (
    <Tab key={path}>
      {icon}
      {label}
    </Tab>
  ))

  return (
    <RoutedPageTabs
      tabPaths={TABS.map(({ path }) => path)}
      defaultTabIndex={DEFAULT_TAB}
    >
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
    </RoutedPageTabs>
  )
}

export default MobileLayout
