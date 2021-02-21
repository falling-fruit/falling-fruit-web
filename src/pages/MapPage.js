import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import Map from '../components/Map'

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
    count: 1000,
  },
  {
    lat: 60.1125785,
    lng: -88.2278543,
    count: 25,
  },
]

const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

const DEFAULT_CENTER_LAT = 40.1125785

const DEFAULT_CENTER_LNG = -88.2287926

const DEFAULT_ZOOM = 1

const DEFAULT_VIEW_STATE = {
  center: [DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG],
  zoom: DEFAULT_ZOOM,
  bounds: null,
}

const MapContainer = styled.div`
  height: 100vh;
  width: 100%;
`

const MapPage = () => {
  const [view, setView] = useState(DEFAULT_VIEW_STATE)
  const [markerData, setMarkerData] = useState([])
  const [showLocations, setShowLocations] = useState(false)

  useEffect(() => {
    if (view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
      // TODO: Fetch cluster data from server
      setMarkerData(clusters)
      setShowLocations(false)
    } else {
      // TODO: Fetch location data from server
      setMarkerData(locations)
      setShowLocations(true)
    }
  }, [view.zoom])

  const onViewChange = ({ center, zoom, bounds }) => {
    setView({ center: [center.lat, center.lng], zoom, bounds })
  }

  const onLocationClick = (id) => {
    // TODO: Fetch location data from server
    console.log('Location clicked: ', id)
  }

  const onClusterClick = (lat, lng) => {
    setView((prevState) => ({
      ...prevState,
      center: [lat, lng],
      zoom: prevState.zoom + 2,
    }))
  }

  return (
    <MapContainer>
      <Map
        bootstrapURLKeys={{
          key: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
        }}
        view={view}
        markerData={markerData}
        showLocations={showLocations}
        onViewChange={onViewChange}
        onLocationClick={onLocationClick}
        onClusterClick={onClusterClick}
      />
    </MapContainer>
  )
}

export default MapPage
