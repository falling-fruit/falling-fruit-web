import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt, UserCircle } from '@styled-icons/boxicons-solid'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { matchPath, useLocation } from 'react-router-dom'

import { useAppHistory } from '../../utils/useAppHistory'
import aboutRoutes from '../about/aboutRoutes'
import { authPages } from '../auth/authRoutes'
import { Tab } from '../ui/PageTabs'

const Tabs = () => {
  const { t } = useTranslation()
  const { pathname, state } = useLocation()
  const history = useAppHistory()
  const { locationId, isBeingEdited, streetViewOpen } = useSelector(
    (state) => state.location,
  )

  const tabs = [
    {
      paths: [
        '/settings',
        ...aboutRoutes.map((route) => route.props.path).flat(),
      ],
      icon: <Cog />,
      label: t('settings'),
    },
    {
      paths: ['/map', '/locations'],
      icon: <MapAlt />,
      label: t('glossary.map'),
    },
    {
      paths: ['/list'],
      icon: <ListUl />,
      label: t('glossary.list'),
    },
    {
      paths: authPages.map((route) => route.path),
      icon: <UserCircle />,
      label: t('glossary.account'),
    },
  ]

  const findMatchingTabIndex = (currentPathname, fromPage) =>
    tabs.findIndex((tab) =>
      tab.paths.some(
        (tabPath) =>
          matchPath(currentPathname, {
            path: tabPath,
            exact: false,
            strict: false,
          }) || tabPath === fromPage,
      ),
    )

  const [tabIndex, setTabIndex] = useState(() => {
    const matchedIndex = findMatchingTabIndex(pathname, state?.fromPage)
    return matchedIndex !== -1 ? matchedIndex : DEFAULT_TAB
  })

  useEffect(() => {
    const matchedIndex = findMatchingTabIndex(pathname, state?.fromPage)
    if (matchedIndex !== -1) {
      setTabIndex(matchedIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, state?.fromPage])

  const handleTabChange = (newTabIndex) => {
    if (newTabIndex === 1 && locationId === 'new') {
      // If switching to the Map tab and adding the location, reopen that view
      // to allow e.g. switching satellite view on
      history.push(`/locations/new`)
    } else if (newTabIndex === 1 && locationId && isBeingEdited) {
      // We could also be editing position of the location
      history.push(`/locations/${locationId}/edit/position`)
    } else if (newTabIndex === 1 && locationId && streetViewOpen) {
      // We could also be viewing the panorama
      history.push(`/locations/${locationId}/panorama`)
    } else if (
      newTabIndex === 0 &&
      pathname.includes('/locations') &&
      state?.fromPage === '/list'
    ) {
      // TODO: this might be an unreachable branch
      // (you can't go from a location page to the settings tab)
      // but hard to understand intention or what fromPage is set to throughout the app
      history.push(pathname, { state: { fromPage: '/map' } })
    } else {
      history.push(tabs[newTabIndex]?.paths[0])
    }
  }

  return {
    tabIndex,
    handleTabChange,
    tabContent: (
      <>
        {tabs.map(({ paths, icon, label }) => (
          <Tab key={paths[0]}>
            {icon}
            {label}
          </Tab>
        ))}
      </>
    ),
  }
}

export const DEFAULT_TAB = 1 // Map

export default Tabs
