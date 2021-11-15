import { CupertinoPane as VanillaCupertinoPane } from 'cupertino-pane'
import PropTypes from 'prop-types'
import { useEffect } from 'react'

/**
 * React wrapper for CupertinoPane
 */
export default function CupertinoPane({ setRef, className, children, config }) {
  useEffect(() => {
    const drawer = new VanillaCupertinoPane(`.${className}`, config)

    /*
      HACK: Fix for race condition using setTimeout @ 0 ms to 
      push present to the end of the synchronous callstack
      */
    setTimeout(() => setRef(drawer), 0)
    setTimeout(() => drawer.present({ animate: true }), 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className])

  return <div className={className}>{children}</div>
}

CupertinoPane.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.any,
  config: PropTypes.any,
}
