import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt, UserCircle } from '@styled-icons/boxicons-solid'

import i18n from '../../i18n.js'
import { authPages } from '../auth/authRoutes.js'

const DEFAULT_TAB = 0 // Map

// Exposed as a function so that labels can be re-translated if language changes
const getTabs = () => [
  {
    paths: ['/map'],
    icon: <MapAlt />,
    label: i18n.t('Map'),
  },
  {
    paths: ['/list'],
    icon: <ListUl />,
    label: i18n.t('List'),
  },
  {
    paths: ['/settings'],
    icon: <Cog />,
    label: i18n.t('Settings'),
  },
  {
    paths: authPages.map((route) => route.path),
    icon: <UserCircle />,
    label: i18n.t('Account'),
  },
]

export { DEFAULT_TAB, getTabs }
