import React, { useState } from 'react'
import styles from './MapPage.module.scss'
import Map from '../../components/Map/Map.js'

// Mock location data
const locations = [
  {
    id: 1,
    lat: 40.1127151,
    lng: -88.2314734,
  },
  {
    id: 2,
    lat: 40.1125785,
    lng: -88.2287926,
  },
  {
    id: 3,
    lat: 40.112657,
    lng: -88.2278543,
  },
  {
    id: 4,
    lat: 60.1125785,
    lng: -88.2287926,
  },
  {
    id: 5,
    lat: 60.112657,
    lng: -88.2278543,
  },
]

const DEFAULT_CENTER_LAT = 40.1125785

const DEFAULT_CENTER_LNG = -88.2287926

const DEFAULT_ZOOM = 2

const DEFAULT_VIEW_STATE = {
  center: [DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG],
  zoom: DEFAULT_ZOOM,
}

const handleViewChange = ({ center, zoom, marginBounds }) => {
  console.log('onBoundsChange center: ', center)
  console.log('onBoundsChange zoom: ', zoom)
  console.log('onBoundsChange bounds: ', marginBounds)
}

const MapPage = () => {
  const [view] = useState(DEFAULT_VIEW_STATE)

  return (
    <div className={styles.mapContainer}>
      <Map
        bootstrapURLKeys={{
          key: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
        }}
        view={view}
        locations={locations}
        onChange={handleViewChange}
      />
    </div>
  )
}

export default MapPage
