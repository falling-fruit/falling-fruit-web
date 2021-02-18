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

// Mock cluster data
const clusters = [
  {
    lat: 40.1127151,
    lng: -88.2314734,
    count: 50,
  },
  {
    lat: 60.1125785,
    lng: -88.2278543,
    count: 25,
  },
]

const DEFAULT_CENTER_LAT = 40.1125785

const DEFAULT_CENTER_LNG = -88.2287926

const DEFAULT_ZOOM = 2

const DEFAULT_VIEW_STATE = {
  center: [DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG],
  zoom: DEFAULT_ZOOM,
  bounds: null,
}

const MapPage = () => {
  const [view, setView] = useState(DEFAULT_VIEW_STATE)

  const handleViewChange = ({ center, zoom, bounds }) => {
    setView({ center: [center.lat, center.lng], zoom, bounds })
  }

  const handleLocationClick = (id) => {
    // TODO: Retrieve location data from server
    console.log('Location clicked: ', id)
  }

  const handleClusterClick = (lat, lng) => {
    setView((prevState) => ({
      ...prevState,
      center: [lat, lng],
      zoom: prevState.zoom + 2,
    }))
  }

  return (
    <div className={styles.mapContainer}>
      <Map
        bootstrapURLKeys={{
          key: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
        }}
        view={view}
        locations={locations}
        clusters={clusters}
        handleViewChange={handleViewChange}
        handleLocationClick={handleLocationClick}
        handleClusterClick={handleClusterClick}
      />
    </div>
  )
}

export default MapPage
