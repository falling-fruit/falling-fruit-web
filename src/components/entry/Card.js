import React, { useEffect } from 'react'

import { sleep } from '../../utils/async'
import CupertinoPane, { ANIMATION_DURATION } from '../ui/CupertinoPane'

export default React.forwardRef(function Card(
  { className, children, config, setDrawer, drawer, isFullScreen },
  ref,
) {
  useEffect(() => {
    let drag = false

    const onClickOutside = async (e) => {
      const { target } = e

      if (!target || drag) {
        return
      }

      const isOutside = !target.closest(`.${className}`)

      if (isOutside && !isFullScreen) {
        const drawerToClose = drawer

        setDrawer(null)

        drawerToClose?.hide({ animate: true })
        await sleep(ANIMATION_DURATION)
        config?.onDidDismiss?.()
      }
    }

    // Only trigger effect on mouse click without drag
    window.addEventListener('mousedown', () => (drag = false))
    window.addEventListener('mousemove', () => (drag = true))
    window.addEventListener('mouseup', onClickOutside)

    return () => {
      window.removeEventListener('mouseup', onClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawer, className, config, isFullScreen])

  return (
    <CupertinoPane
      ref={ref}
      setDrawer={setDrawer}
      className={className}
      config={config}
    >
      {children}
    </CupertinoPane>
  )
})
