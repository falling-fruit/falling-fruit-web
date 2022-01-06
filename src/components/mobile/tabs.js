import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt, UserCircle } from '@styled-icons/boxicons-solid'

import i18n from '../../i18n.js'
import AccountPage from '../auth/AccountPage.js'
import MapPage from '../map/MapPage'
import SettingsPage from '../settings/SettingsPage'
import ListPage from './ListPage'

const DEFAULT_TAB = 0 // Map

// Exposed as a function so that labels can be re-translated if language changes
const getTabs = () => [
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
  {
    path: '/settings',
    icon: <Cog />,
    label: i18n.t('Settings'),
    panel: <SettingsPage />,
  },
  {
    path: '/account',
    icon: <UserCircle />,
    label: i18n.t('Account'),
    panel: <AccountPage />,
  },
]

export { DEFAULT_TAB, getTabs }
