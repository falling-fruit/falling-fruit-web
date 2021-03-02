import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt } from '@styled-icons/boxicons-solid'
import { useHistory, useLocation } from 'react-router-dom'

import MapPage from '../map/MapPage'
import { LinkTab, PageTabs, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
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

const useDefaultTabIndex = () => {
  const { pathname } = useLocation()
  const history = useHistory()

  let defaultIndex = TABS.findIndex(({ path }) => path === pathname)
  // eslint-disable-next-line no-magic-numbers
  if (defaultIndex === -1) {
    // If no path,
    history.replace(TABS[DEFAULT_TAB].path)
    defaultIndex = DEFAULT_TAB
  }

  return defaultIndex
}

const MobileLayout = () => {
  const defaultTabIndex = useDefaultTabIndex()

  return (
    <PageTabs defaultIndex={defaultTabIndex}>
      <TabPanels>
        <TopBarSwitch />
        {TABS.map(({ path, panel }) => (
          <TabPanel key={path}>{panel}</TabPanel>
        ))}
      </TabPanels>
      <TabList>
        {TABS.map(({ path, icon, label }) => (
          <LinkTab key={path} to={path}>
            {icon}
            {label}
          </LinkTab>
        ))}
      </TabList>
    </PageTabs>
  )
}

export default MobileLayout
