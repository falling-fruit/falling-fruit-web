import React from 'react'

import CupertinoPane from '../ui/CupertinoPane'

export default React.forwardRef(function Card(
  { className, children, config },
  ref,
) {
  return (
    <CupertinoPane ref={ref} className={className} config={config}>
      {children}
    </CupertinoPane>
  )
})
