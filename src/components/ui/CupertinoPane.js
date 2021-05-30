import { CupertinoPane as VanillaCupertinoPane } from 'cupertino-pane'
import PropTypes from 'prop-types'
import { useEffect } from 'react'

/**
 * React wrapper for CupertinoPane
 */
export default function CupertinoPane({ id, children, config }) {
  useEffect(() => {
    const drawer = new VanillaCupertinoPane(`#${id}`, config)

    /*
      HACK: Fix for race condition using setTimeout @ 0 ms to 
      push present to the end of the synchronous callstack
      */
    setTimeout(() => drawer.present({ animate: true }), 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return <div id={id}>{children}</div>
}

CupertinoPane.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.any,
  config: PropTypes.any,
}
