import { Route, Switch } from 'react-router-dom'

import useRoutedTabs from '../../utils/useRoutedTabs'
import EntryDetails from '../entry/EntryDetails'
import { PageTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import { DEFAULT_TAB, TABS } from './tabs'
import TopBarSwitch from './TopBarSwitch'

const MobileLayout = () => {
  const [tabIndex, handleTabChange] = useRoutedTabs(
    TABS.map(({ path }) => path),
    DEFAULT_TAB,
  )

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
