import { useTranslation } from 'react-i18next'
import { Route, Switch } from 'react-router-dom'

import useRoutedTabs from '../../utils/useRoutedTabs'
import Drawer from '../entry/Drawer'
import Entry from '../entry/Entry'
import { LocationForm } from '../form/LocationForm'
import { PageTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import { DEFAULT_TAB, getTabs } from './tabs'
import TopBarSwitch from './TopBarSwitch'

const MobileLayout = () => {
  useTranslation()
  const tabs = getTabs()

  const [tabIndex, handleTabChange] = useRoutedTabs(
    tabs.map(({ path }) => path),
    DEFAULT_TAB,
  )

  const tabPanels = tabs.map(({ path, panel }) => (
    <TabPanel
      style={path === '/list' ? { paddingTop: '85px' } : { paddingTop: '0' }}
      key={path}
    >
      {panel}
    </TabPanel>
  ))

  const tabList = tabs.map(({ path, icon, label }) => (
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
          <Route path="/map/entry/new/details">
            <LocationForm />
          </Route>
          <Route path="/list/entry/:id">
            <Entry />
          </Route>
          <Route path={['/map', '/list', '/settings', '/map/entry/new']}>
            <Switch>
              <Route path="/map/entry/new" />
              <Route path="/map/entry/:id">
                <Drawer>
                  <Entry isInDrawer />
                </Drawer>
              </Route>
            </Switch>
            {tabPanels}
          </Route>
        </Switch>
      </TabPanels>
      <Switch>
        <Route path="/map/entry/new/details" />
        <Route>
          {
            // TODO use z-index from enum and override in PageTabs
          }
          <TabList style={{ zIndex: 999 }}>{tabList}</TabList>
        </Route>
      </Switch>
    </PageTabs>
  )
}

export default MobileLayout
