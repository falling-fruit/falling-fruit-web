import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import Map from '../components/Map'

// Mock location data
const locationData = [
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
const clusterData = [
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

/**
 * Maximum zoom level at which clusters will be displayed. At zoom levels
 * greater than VISIBLE_CLUSTER_ZOOM_LIMIT, locations will be displayed.
 * @constant {number}
 */
const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

/**
 * Default latitude of the map's center.
 * @constant {number}
 */
const DEFAULT_CENTER_LAT = 40.1125785

/**
 * Default longitude of the map's center.
 * @constant {number}
 */
const DEFAULT_CENTER_LNG = -88.2287926

/**
 * Default zoom level.
 * @constant {number}
 */
const DEFAULT_ZOOM = 1

/**
 * Default view state of the map.
 * @constant {Object}
 * @property {number[]} center - The latitude and longitude of the map's center
 * @property {number} zoom - The map's zoom level
 * @property {Object} bounds - The latitude and longitude of the map's NE, NW, SE, and SW corners
 */
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
  const [locations, setLocations] = useState([])
  const [clusters, setClusters] = useState([])

  useEffect(() => {
    if (view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
      // TODO: Fetch cluster data from server
      setClusters(clusterData)
      setLocations([])
    } else {
      // TODO: Fetch location data from server
      setLocations(locationData)
      setClusters([])
    }
  }, [view.zoom])

  const onViewChange = ({ center, zoom, bounds }) => {
    setView({ center: [center.lat, center.lng], zoom, bounds })
  }

  const onLocationClick = (location) => {
    // TODO: Fetch location data from server
    console.log('Location clicked: ', location.id)
  }

  const onClusterClick = (cluster) => {
    setView((prevState) => ({
      ...prevState,
      center: [cluster.lat, cluster.lng],
      zoom: prevState.zoom + 2,
    }))
  }

  return (
    <MapContainer>
      <Map
        googleMapsAPIKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        view={view}
        locations={locations}
        clusters={clusters}
        onViewChange={onViewChange}
        onLocationClick={onLocationClick}
        onClusterClick={onClusterClick}
      />
    </MapContainer>
  )
}

export default MapPage
