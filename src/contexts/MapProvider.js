import { useState } from 'react'

import { DEFAULT_VIEW_STATE } from '../contexts/MapContext'

const MapProvider = (MapContext, children) => {
  const [view, setView] = useState(DEFAULT_VIEW_STATE)
  return (
    <MapContext.Provider value={{ view, setView }}>
      {children}
    </MapContext.Provider>
  )
}

export default MapProvider
