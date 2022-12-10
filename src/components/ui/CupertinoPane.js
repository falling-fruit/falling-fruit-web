import { CupertinoPane as VanillaCupertinoPane } from 'cupertino-pane'
import React, { useEffect } from 'react'

export const ANIMATION_DURATION = 300

/**
 * React wrapper for CupertinoPane
 */
export default React.forwardRef(function CupertinoPane(
  { className, children, config, setDrawer },
  ref,
) {
  useEffect(() => {
    const drawer = new VanillaCupertinoPane(`.${className}`, {
      ...config,
      animationDuration: ANIMATION_DURATION,
    })
    setDrawer(drawer)
    /*
      HACK: Fix for race condition using setTimeout @ 0 ms to 
      push present to the end of the synchronous callstack
      */
    setTimeout(() => drawer.present({ animate: true }), 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
})
