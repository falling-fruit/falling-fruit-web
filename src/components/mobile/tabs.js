import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt } from '@styled-icons/boxicons-solid'

import MapPage from '../map/MapPage'
import SettingsPage from './SettingsPage'

const DEFAULT_TAB = 1 // Map

const TABS = [
  {
    path: '/settings',
    icon: <Cog />,
    label: 'Settings',
    panel: <SettingsPage />,
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

const PATH_TO_INDEX = {}
TABS.forEach(({ path }, index) => {
  PATH_TO_INDEX[path] = index
})

export { DEFAULT_TAB, PATH_TO_INDEX, TABS }
