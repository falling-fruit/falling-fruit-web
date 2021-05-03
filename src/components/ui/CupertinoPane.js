import { CupertinoPane } from 'cupertino-pane'
import React, { useEffect } from 'react'

/**
 * React wrapper for CupertinoPane
 */
export default function CupertinoPaneWrapper({ id, children, config }) {
  useEffect(() => {
    const drawer = new CupertinoPane(`#${id}`, config)

    /*
      HACK: Fix for race condition using setTimeout @ 0 ms to 
      push present to the end of the synchronous callstack
      */
    setTimeout(() => drawer.present({ animate: true }), 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return <div id={id}>{children}</div>
}
