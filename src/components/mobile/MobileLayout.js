import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt } from '@styled-icons/boxicons-solid'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'

import MapPage from '../map/MapPage'
import { LinkTab, PageTabs, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import EntryPage from './EntryPage'
import Settings from './Settings'
import TopBarSwitch from './TopBarSwitch'

const DEFAULT_TAB = 1 // Map
const TABS = [
  {
    path: '/settings',
    icon: <Cog />,
    label: 'Settings',
    panel: <Settings />,
  },
  {
    path: '/map',
    icon: <MapAlt />,
    label: 'Map',
    panel: <MapPage />,
  },
  {
    path: '/list',
    icon: <ListUl />,
    label: 'List',
    panel: <p>List</p>,
  },
]

/**
 * Hook to get the default tab index on page load from the URL path.
 */
const useDefaultTabIndex = () => {
  const { pathname } = useLocation()
  const history = useHistory()

  let defaultIndex = TABS.findIndex(({ path }) => path === pathname)
  // eslint-disable-next-line no-magic-numbers
  if (defaultIndex === -1) {
    defaultIndex = DEFAULT_TAB
    // Replace default URL with path to default tab but ignore "real" paths, like /entry
    if (pathname === '/') {
      history.replace(TABS[DEFAULT_TAB].path)
    }
  }

  return defaultIndex
}

const MobileLayout = () => {
  const defaultTabIndex = useDefaultTabIndex()

  const tabPanels = TABS.map(({ path, panel }) => (
    <TabPanel key={path}>{panel}</TabPanel>
  ))
  const tabList = TABS.map(({ path, icon, label }) => (
    <LinkTab key={path} to={path}>
      {icon}
      {label}
    </LinkTab>
  ))

  return (
    <PageTabs defaultIndex={defaultTabIndex}>
      <TabPanels>
        <TopBarSwitch />
        <Switch>
          <Route path="/entry">
            <EntryPage />
          </Route>
          <Route>{tabPanels}</Route>
        </Switch>
      </TabPanels>
      <TabList>{tabList}</TabList>
    </PageTabs>
  )
}

export default MobileLayout
