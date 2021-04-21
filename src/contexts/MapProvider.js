import { useState } from 'react'

import { DEFAULT_VIEW_STATE } from '../contexts/MapContext'

const MapProvider = (MapContext) => {
  const MapContextProvider = ({ children, ...props }) => {
    const [view, setView] = useState(DEFAULT_VIEW_STATE)
    return (
      <MapContext.Provider value={{ view, setView }} {...props}>
        {children}
      </MapContext.Provider>
    )
  }
  return MapContextProvider
}

export default MapProvider
