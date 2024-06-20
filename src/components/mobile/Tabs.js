import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt, UserCircle } from '@styled-icons/boxicons-solid'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath, useLocation } from 'react-router-dom'

import { useAppHistory } from '../../utils/useAppHistory'
import { authPages } from '../auth/authRoutes'
import { Tab } from '../ui/PageTabs'

const Tabs = () => {
  const { t } = useTranslation()
  const { pathname, state } = useLocation()
  const history = useAppHistory()

  const tabs = [
    {
      paths: ['/settings'],
      icon: <Cog />,
      label: t('settings'),
    },
    {
      paths: ['/map'],
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
    if (
      newTabIndex === 0 &&
      pathname.includes('/locations') &&
      state?.fromPage === '/list'
    ) {
      // TODO: unreachable branch
      // (you can't go from a location page to the settings tab)
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
