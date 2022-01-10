import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt, UserCircle } from '@styled-icons/boxicons-solid'

import i18n from '../../i18n.js'

const DEFAULT_TAB = 0 // Map

// Exposed as a function so that labels can be re-translated if language changes
const getTabs = () => [
  {
    path: '/map',
    icon: <MapAlt />,
    label: i18n.t('Map'),
  },
  {
    path: '/list',
    icon: <ListUl />,
    label: i18n.t('List'),
  },
  {
    path: '/settings',
    icon: <Cog />,
    label: i18n.t('Settings'),
  },
  {
    path: '/account',
    icon: <UserCircle />,
    label: i18n.t('Account'),
  },
]

export { DEFAULT_TAB, getTabs }
