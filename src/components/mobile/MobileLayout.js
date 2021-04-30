import { Route, Switch } from 'react-router-dom'

import useRoutedTabs from '../../utils/useRoutedTabs'
import Drawer from '../entry/Drawer'
import EntryDetails from '../entry/EntryDetails'
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
          <Route path={['/map/entry/new/details', '/list/entry/new/details']}>
            <LocationForm />
          </Route>
          <Route path="/map/entry/:id">
            <Drawer>
              <EntryDetails />
            </Drawer>
          </Route>
          <Route path="/list/entry/:id">
            <EntryDetails />
          </Route>
          <Route path={['/map', '/list', '/settings', '/entry/new']}>
            {tabPanels}
          </Route>
        </Switch>
      </TabPanels>
      <Switch>
        <Route
          path={['/map/entry/new/details', '/list/entry/new/details']}
        ></Route>
        <Route>
          <TabList>{tabList}</TabList>
        </Route>
      </Switch>
    </PageTabs>
  )
}

export default MobileLayout
