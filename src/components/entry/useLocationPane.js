import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { useIsDesktop, useIsEmbed } from '../../utils/useBreakpoint'

const useLocationPane = () => {
  const history = useHistory()
  const { search, pathname } = useLocation()
  const isEmbed = useIsEmbed()
  const isDesktop = useIsDesktop()

  const params = new URLSearchParams(search)
  const paneParam = params.get('pane') // 'low' | 'full' | null -> middle position
  const tabParam = params.get('tab') // '1' | null -> 0
  const saveParam = params.get('save') // 'true' | null

  const drawerFullyOpen = isEmbed || paneParam === 'full'
  const drawerLow = !isEmbed && paneParam === 'low'
  const tabIndex = drawerFullyOpen && tabParam === '1' ? 1 : 0
  // The save-to-list dropdown open flag lives in the URL so it survives the
  // sheet -> full-page remount that happens when opening the drawer.
  const saveDropdownOpen = saveParam === 'true'

  const setParams = useCallback(
    (newPaneValue, newTabValue, newSaveValue) => {
      const next = new URLSearchParams(search)

      if (newPaneValue === null || newPaneValue === undefined) {
        next.delete('pane')
      } else {
        next.set('pane', newPaneValue)
      }

      if (
        newTabValue === null ||
        newTabValue === undefined ||
        newTabValue === 0
      ) {
        next.delete('tab')
      } else {
        next.set('tab', String(newTabValue))
      }

      if (newSaveValue) {
        next.set('save', 'true')
      } else {
        next.delete('save')
      }

      const nextSearch = next.toString()
      const nextSearchString = nextSearch ? `?${nextSearch}` : ''

      if (nextSearchString === search) {
        return
      }

      history.push({
        pathname,
        search: nextSearchString,
      })
    },
    [history, pathname, search],
  )

  const setPaneParam = useCallback(
    (newPaneValue) => {
      const isLeavingFullyOpen = drawerFullyOpen && newPaneValue !== 'full'
      setParams(
        newPaneValue,
        isLeavingFullyOpen ? null : tabIndex === 0 ? null : tabIndex,
        // Closing/collapsing the drawer also closes the save dropdown.
        newPaneValue === 'full' ? saveDropdownOpen : false,
      )
    },
    [setParams, tabIndex, drawerFullyOpen, saveDropdownOpen],
  )

  const fullyOpenPaneDrawer = useCallback(() => {
    setPaneParam('full')
  }, [setPaneParam])

  const fullyOpenPaneDrawerIfMobile = useCallback(() => {
    if (!isDesktop) {
      fullyOpenPaneDrawer()
    }
  }, [isDesktop, fullyOpenPaneDrawer])

  const setPaneDrawerToMiddlePosition = useCallback(() => {
    setPaneParam(null)
  }, [setPaneParam])

  const setPaneDrawerToLowPosition = useCallback(() => {
    setPaneParam('low')
  }, [setPaneParam])

  const setTabIndex = useCallback(
    (index) => {
      setParams(paneParam, index === 0 ? null : index, saveDropdownOpen)
    },
    [setParams, paneParam, saveDropdownOpen],
  )

  // Open the save-to-list dropdown. On mobile this also fully opens the
  // drawer, and the flag is encoded in the URL so it survives the remount.
  const openSaveDropdown = useCallback(() => {
    const nextPane = isDesktop ? paneParam : 'full'
    setParams(nextPane, tabIndex === 0 ? null : tabIndex, true)
  }, [setParams, isDesktop, paneParam, tabIndex])

  const closeSaveDropdown = useCallback(() => {
    setParams(paneParam, tabIndex === 0 ? null : tabIndex, false)
  }, [setParams, paneParam, tabIndex])

  // Open the report modal. On mobile this also fully opens the drawer, in a
  // single navigation so neither param clobbers the other.
  const openReportModal = useCallback(() => {
    const next = new URLSearchParams(search)
    next.set('report', 'true')
    if (!isDesktop) {
      next.set('pane', 'full')
    }
    const nextSearch = next.toString()
    history.push({ pathname, search: nextSearch ? `?${nextSearch}` : '' })
  }, [history, pathname, search, isDesktop])

  return {
    drawerFullyOpen,
    drawerLow,
    tabIndex,
    saveDropdownOpen,
    fullyOpenPaneDrawer,
    fullyOpenPaneDrawerIfMobile,
    setPaneDrawerToMiddlePosition,
    setPaneDrawerToLowPosition,
    setTabIndex,
    openSaveDropdown,
    closeSaveDropdown,
    openReportModal,
  }
}

export default useLocationPane
