import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  NumberParam,
  NumericObjectParam,
  useQueryParams,
} from 'use-query-params'

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
const _DEFAULT_VIEW_STATE = {
  center: { lat: DEFAULT_CENTER_LAT, lng: DEFAULT_CENTER_LNG },
  zoom: DEFAULT_ZOOM,
  bounds: null,
}

const MapPage = () => {
  const [view, setView] = useQueryParams({
    center: NumericObjectParam,
    zoom: NumberParam,
  })

  const [bounds, setBounds] = useQueryParams({
    ne: NumericObjectParam,
    nw: NumericObjectParam,
    se: NumericObjectParam,
    sw: NumericObjectParam,
  })

  const [locations, setLocations] = useState([])
  const [clusters, setClusters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchClusterAndLocationData() {
      if (bounds.ne?.lng) {
        // Map has received real bounds
        console.log(bounds, 'here1')
        setIsLoading(true)
        const query = {
          swlng: bounds.sw.lng,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          nelat: bounds.ne.lat,
          muni: 1,
        }
        if (view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
          const clusters = await getClusters({ ...query, zoom: view.zoom })
          setClusters(clusters)
          setLocations([])
        } else {
          const [
            _numLocationsReturned,
            _totalLocations,
            ...locations
          ] = await getLocations(query)
          setLocations(locations)
          setClusters([])
        }
        setIsLoading(false)
      }
    }
    fetchClusterAndLocationData()
  }, [view, bounds])

  const onViewChange = ({ center, zoom, bounds }) => {
    console.log(bounds, 'here2')
    console.log('onViewChange called', { center, zoom, bounds })
    setView({ center: [center.lat, center.lng], zoom })
    setBounds(bounds)
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
    <>
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
    </>
  )
}

export default MapPage
