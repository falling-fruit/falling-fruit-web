import '@reach/tabs/styles.css'

import {
  Tab as ReachTab,
  TabList as ReachTabList,
  TabPanel as ReachTabPanel,
  TabPanels as ReachTabPanels,
  Tabs,
} from '@reach/tabs'
import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt, User, UserCircle } from '@styled-icons/boxicons-solid'
import { StyledIconBase } from '@styled-icons/styled-icon'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { matchPath, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { TABS_HEIGHT_PX } from '../../constants/mobileLayout'
import { useAppHistory } from '../../utils/useAppHistory'
import { accountPages } from '../account/accountRoutes'
import { authPages } from '../auth/authRoutes'
import { zIndex } from '../ui/GlobalStyle'

const PageTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;

  .page-tab-panels[data-reach-tab-panels] {
    flex: 1;
    display: flex;
    overflow: hidden;

    .page-tab-panel[data-reach-tab-panel],
    > div {
      flex: 1;
    }
  }

  .page-tab-list[data-reach-tab-list] {
    display: flex;
    height: ${TABS_HEIGHT_PX}px;

    background: ${({ theme }) => theme.background};

    padding-block-end: env(safe-area-inset-bottom, 0);

    &::after {
      content: '';
      position: absolute;
      inset-inline: 0;
      inset-block-end: 0;
      height: env(safe-area-inset-bottom, 0);
      background: ${({ theme }) => theme.secondaryBackground};
      z-index: ${zIndex.topBar + 1};
    }

    .page-tab[data-reach-tab] {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-block-start: 4px solid ${({ theme }) => theme.secondaryBackground};
      font-size: 0.675rem;

      border-block-end: none;

      :focus {
        outline: none;
      }

      ${StyledIconBase} {
        display: block;
        margin-inline: auto;
        margin-block: 0 2px;
        height: 24px;
      }

      &[data-selected] {
        color: ${({ theme }) => theme.orange};
        border-block-start-color: ${({ theme }) => theme.orange};

        ${StyledIconBase} {
          color: ${({ theme }) => theme.orange};
        }
      }
    }
  }
`

const Tab = styled(ReachTab).attrs({ className: 'page-tab' })``
const TabList = styled(ReachTabList).attrs({ className: 'page-tab-list' })``
const TabPanel = styled(ReachTabPanel).attrs({ className: 'page-tab-panel' })``
const TabPanels = styled(ReachTabPanels).attrs({
  className: 'page-tab-panels',
})``

// Hook
const useTabs = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const history = useAppHistory()
  const {
    isBeingInitializedMobile,
    locationId,
    isBeingEdited,
    streetViewOpen,
  } = useSelector((state) => state.location)
  const isLoggedIn = useSelector((state) => !!state.auth.user)

  const tabs = [
    {
      paths: ['/settings'],
      icon: <Cog />,
      label: t('menu.settings'),
    },
    {
      paths: ['/map', '/locations'],
      icon: <MapAlt />,
      label: t('glossary.map'),
    },
    {
      paths: ['/list'],
      icon: <ListUl />,
      label: t('menu.list'),
    },
    {
      paths: [
        ...authPages.map((route) => route.path),
        ...accountPages.map((route) => route.path),
      ],
      icon: isLoggedIn ? <UserCircle /> : <User />,
      label: isLoggedIn ? t('glossary.account') : t('users.sign_in'),
    },
  ]

  const findMatchingTabIndex = (currentPathname) =>
    tabs.findIndex((tab) =>
      tab.paths.some((tabPath) =>
        matchPath(currentPathname, {
          path: tabPath,
          exact: false,
          strict: false,
        }),
      ),
    )

  const [tabIndex, setTabIndex] = useState(() => {
    const matchedIndex = findMatchingTabIndex(pathname)
    return matchedIndex !== -1 ? matchedIndex : DEFAULT_TAB
  })

  useEffect(() => {
    const matchedIndex = findMatchingTabIndex(pathname)
    if (matchedIndex !== -1) {
      setTabIndex(matchedIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const handleTabChange = (newTabIndex) => {
    if (newTabIndex === 1 && isBeingInitializedMobile) {
      // If switching to the Map tab and adding the location, reopen that view
      // to allow e.g. switching satellite view on
      history.push(`/locations/init`)
    } else if (newTabIndex === 1 && locationId && isBeingEdited) {
      // We could also be editing position of the location
      history.push(`/locations/${locationId}/edit/position`)
    } else if (newTabIndex === 1 && locationId && streetViewOpen) {
      // We could also be viewing the panorama
      history.push(`/locations/${locationId}/panorama`)
    } else if (newTabIndex === 3) {
      // Logged in users go to account page
      if (isLoggedIn) {
        history.push('/account/edit')
      } else {
        // Otherwise sign in
        history.pushToSignInPage()
      }
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

export { PageTabs, Tab, TabList, TabPanel, TabPanels, useTabs }
