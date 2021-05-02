import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt } from '@styled-icons/boxicons-solid'

import i18n from '../../i18n.js'
import MapPage from '../map/MapPage'
import SettingsPage from '../settings/SettingsPage'
import ListPage from './ListPage'

const DEFAULT_TAB = 1 // Map

const getTabs = () => [
  {
    path: '/settings',
    icon: <Cog />,
    label: i18n.t('Settings'),
    panel: <SettingsPage />,
  },
  {
    path: '/map',
    icon: <MapAlt />,
    label: i18n.t('Map'),
    panel: <MapPage />,
  },
  {
    path: '/list',
    icon: <ListUl />,
    label: i18n.t('List'),
    panel: <ListPage />,
  },
]

export { DEFAULT_TAB, getTabs }
