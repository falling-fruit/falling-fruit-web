import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { useIsEmbed } from '../../utils/useBreakpoint'

const useLocationPane = () => {
  const history = useHistory()
  const { search, pathname } = useLocation()
  const isEmbed = useIsEmbed()

  const params = new URLSearchParams(search)
  const paneParam = params.get('pane') // 'low' | 'full' | null -> middle position
  const tabParam = params.get('tab') // '1' | null -> 0

  const drawerFullyOpen = isEmbed || paneParam === 'full'
  const drawerLow = !isEmbed && paneParam === 'low'
  const tabIndex = drawerFullyOpen && tabParam === '1' ? 1 : 0

  const setParams = useCallback(
    (newPaneValue, newTabValue) => {
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
      )
    },
    [setParams, tabIndex, drawerFullyOpen],
  )

  const fullyOpenPaneDrawer = useCallback(() => {
    setPaneParam('full')
  }, [setPaneParam])

  const setPaneDrawerToMiddlePosition = useCallback(() => {
    setPaneParam(null)
  }, [setPaneParam])

  const setPaneDrawerToLowPosition = useCallback(() => {
    setPaneParam('low')
  }, [setPaneParam])

  const setTabIndex = useCallback(
    (index) => {
      setParams(paneParam, index === 0 ? null : index)
    },
    [setParams, paneParam],
  )

  return {
    drawerFullyOpen,
    drawerLow,
    tabIndex,
    fullyOpenPaneDrawer,
    setPaneDrawerToMiddlePosition,
    setPaneDrawerToLowPosition,
    setTabIndex,
  }
}

export default useLocationPane
