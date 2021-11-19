import React from 'react'

import CupertinoPane from '../ui/CupertinoPane'

export default React.forwardRef(function Card(
  { className, children, config, setDrawer },
  ref,
) {
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
