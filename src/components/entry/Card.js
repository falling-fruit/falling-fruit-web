import React, { useEffect } from 'react'

import { sleep } from '../../utils/async'
import CupertinoPane, { ANIMATION_DURATION } from '../ui/CupertinoPane'

export default React.forwardRef(function Card(
  { className, children, config, setDrawer, drawer, isFullScreen },
  ref,
) {
  useEffect(() => {
    const onClickOutside = async (e) => {
      const { target } = e

      if (!target) {
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

    window.addEventListener('click', onClickOutside)

    return () => {
      window.removeEventListener('click', onClickOutside)
    }
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
