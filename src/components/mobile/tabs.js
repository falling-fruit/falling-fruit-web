import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt, UserCircle } from '@styled-icons/boxicons-solid'

import i18n from '../../i18n'
import { authPages } from '../auth/authRoutes'

const DEFAULT_TAB = 0 // Map

// Exposed as a function so that labels can be re-translated if language changes
const getTabs = () => [
  {
    paths: ['/settings'],
    icon: <Cog />,
    label: i18n.t('settings'),
  },
  {
    paths: ['/map'],
    icon: <MapAlt />,
    label: i18n.t('map'),
  },
  {
    paths: ['/list'],
    icon: <ListUl />,
    label: i18n.t('list'),
  },
  {
    paths: authPages.map((route) => route.path),
    icon: <UserCircle />,
    label: i18n.t('glossary.account'),
  },
]

export { DEFAULT_TAB, getTabs }
