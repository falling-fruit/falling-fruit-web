import { Route, Switch } from 'react-router-dom'

import useRoutedTabs from '../../utils/useRoutedTabs'
import EntryOverview from '../entry/EntryOverview'
import { LocationForm } from '../form/LocationForm'
import { PageTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import { DEFAULT_TAB, TABS } from './tabs'
import TopBarSwitch from './TopBarSwitch'

const MobileLayout = () => {
  const [tabIndex, handleTabChange] = useRoutedTabs(
    TABS.map(({ path }) => path),
    DEFAULT_TAB,
  )

  const tabPanels = TABS.map(({ path, panel }) => (
    <TabPanel
      style={path === '/list' ? { paddingTop: '85px' } : { paddingTop: '0' }}
      key={path}
    >
      {panel}
    </TabPanel>
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
          <Route path="/entry/new/details">
            <LocationForm />
          </Route>
          <Route path={['/map', '/list', '/settings', '/entry/new']}>
            {tabPanels}
          </Route>
          <Route path="/entry/:id">
            <EntryOverview />
          </Route>
        </Switch>
      </TabPanels>
      <Switch>
        <Route path="/entry/new/details"></Route>
        <Route>
          <TabList>{tabList}</TabList>
        </Route>
      </Switch>
    </PageTabs>
  )
}

export default MobileLayout
