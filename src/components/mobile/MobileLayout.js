import { useTranslation } from 'react-i18next'
import { Route, Switch } from 'react-router-dom'

import useRoutedTabs from '../../utils/useRoutedTabs'
import EntryTabs from '../entry/EntryTabs'
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
          <Route path="/entry/new/details">
            <LocationForm />
          </Route>
          <Route path={['/map', '/list', '/settings', '/entry/new']}>
            {tabPanels}
          </Route>
          <Route path="/entry/:id">
            <EntryTabs />
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
