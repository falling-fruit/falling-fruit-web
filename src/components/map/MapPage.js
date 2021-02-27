import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { getClusters, getLocations } from '../../utils/api'
import Map from './Map'

const LoadingText = styled.p`
  position: absolute;
  z-index: 1;
`

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

const MapPage = () => {
  const [view, setView] = useState(DEFAULT_VIEW_STATE)
  const [locations, setLocations] = useState([])
  const [clusters, setClusters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchClusterAndLocationData() {
      if (view.bounds) {
        setIsLoading(true)
        if (view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
          const query = {
            swlng: view.bounds.sw.lng,
            nelng: view.bounds.ne.lng,
            swlat: view.bounds.sw.lat,
            nelat: view.bounds.ne.lat,
            zoom: view.zoom,
            muni: 1,
          }
          const clusters = await getClusters(query)
          setClusters(clusters)
          setLocations([])
        } else {
          const query = {
            swlng: view.bounds.sw.lng,
            nelng: view.bounds.ne.lng,
            swlat: view.bounds.sw.lat,
            nelat: view.bounds.ne.lat,
            muni: 1,
          }
          const locations = await getLocations(query)
          // Remove number of locations returned and total locations available from result
          locations.splice(0, 2)
          setLocations(locations)
          setClusters([])
        }
        setIsLoading(false)
      }
    }
    fetchClusterAndLocationData()
  }, [view])

  const onViewChange = ({ center, zoom, bounds }) => {
    console.log('onViewChange called', { center, zoom, bounds })
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
    <div style={{ height: '100%', width: '100%' }}>
      {isLoading && <LoadingText>Loading...</LoadingText>}
      <Map
        googleMapsAPIKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        view={view}
        locations={locations}
        clusters={clusters}
        onViewChange={onViewChange}
        onLocationClick={onLocationClick}
        onClusterClick={onClusterClick}
      />
    </div>
  )
}

export default MapPage
