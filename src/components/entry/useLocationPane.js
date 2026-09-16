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
  const reportParam = params.get('report') // 'true' | null

  const drawerFullyOpen = isEmbed || paneParam === 'full'
  const drawerLow = !isEmbed && paneParam === 'low'
  const tabIndex = drawerFullyOpen && tabParam === '1' ? 1 : 0
  const saveDropdownOpen = saveParam === 'true'
  const reportModalOpen = reportParam === 'true'

  const setParams = useCallback(
    (
      newPaneValue,
      newTabValue,
      {
        save = saveParam === 'true',
        report = reportParam === 'true',
        state,
      } = {},
    ) => {
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

      if (save) {
        next.set('save', 'true')
      } else {
        next.delete('save')
      }

      if (report) {
        next.set('report', 'true')
      } else {
        next.delete('report')
      }

      const nextSearch = next.toString()
      const nextSearchString = nextSearch ? `?${nextSearch}` : ''

      if (nextSearchString === search && state === undefined) {
        return
      }

      history.push({
        pathname,
        search: nextSearchString,
        state,
      })
    },
    [history, pathname, search, saveParam, reportParam],
  )

  const setPaneParam = useCallback(
    (newPaneValue) => {
      const isLeavingFullyOpen = drawerFullyOpen && newPaneValue !== 'full'
      setParams(
        newPaneValue,
        isLeavingFullyOpen ? null : tabIndex === 0 ? null : tabIndex,
        { save: newPaneValue === 'full' ? saveDropdownOpen : false },
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
      setParams(paneParam, index === 0 ? null : index, {
        save: saveDropdownOpen,
      })
    },
    [setParams, paneParam, saveDropdownOpen],
  )

  const openSaveDropdown = useCallback(() => {
    const nextPane = isDesktop ? paneParam : 'full'
    setParams(nextPane, tabIndex === 0 ? null : tabIndex, { save: true })
  }, [setParams, isDesktop, paneParam, tabIndex])

  const closeSaveDropdown = useCallback(() => {
    setParams(paneParam, tabIndex === 0 ? null : tabIndex, { save: false })
  }, [setParams, paneParam, tabIndex])

  const openReportModal = useCallback(
    (state) => {
      const nextPane = isDesktop ? paneParam : 'full'
      setParams(nextPane, tabIndex === 0 ? null : tabIndex, {
        report: true,
        state,
      })
    },
    [setParams, isDesktop, paneParam, tabIndex],
  )

  const closeReportModal = useCallback(() => {
    setParams(paneParam, tabIndex === 0 ? null : tabIndex, { report: false })
  }, [setParams, paneParam, tabIndex])

  return {
    drawerFullyOpen,
    drawerLow,
    tabIndex,
    saveDropdownOpen,
    reportModalOpen,
    fullyOpenPaneDrawer,
    fullyOpenPaneDrawerIfMobile,
    setPaneDrawerToMiddlePosition,
    setPaneDrawerToLowPosition,
    setTabIndex,
    openSaveDropdown,
    closeSaveDropdown,
    openReportModal,
    closeReportModal,
  }
}

export default useLocationPane
