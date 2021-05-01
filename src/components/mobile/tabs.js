import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt } from '@styled-icons/boxicons-solid'

import MapPage from '../map/MapPage'
import SettingsPage from '../settings/SettingsPage'
import ListPage from './ListPage'

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
    panel: <ListPage />,
  },
]

export { DEFAULT_TAB, TABS }
