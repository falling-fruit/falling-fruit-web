import { fitBounds } from 'google-map-react'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { NumericObjectParam, useQueryParams } from 'use-query-params'

import { getClusters, getLocations } from '../../utils/api'
import Map from './Map'

const LoadingText = styled.p`
  position: absolute;
  top: 0;
  left: 0;
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
  center: { lat: DEFAULT_CENTER_LAT, lng: DEFAULT_CENTER_LNG },
  zoom: DEFAULT_ZOOM,
}

const MapPage = () => {
  const container = useRef(null)

  const fitContainerBounds = (bounds) => {
    const { offsetWidth, offsetHeight } = container.current
    return fitBounds(bounds, {
      width: offsetWidth,
      height: offsetHeight,
    })
  }

  const [view, setView] = useState(DEFAULT_VIEW_STATE)
  const [bounds, setBounds] = useQueryParams({
    ne: NumericObjectParam,
    sw: NumericObjectParam,
  })

  // Allow setting view via bounds
  useEffect(() => {
    if (bounds) {
      setView(fitContainerBounds(bounds))
    }
  }, [bounds, setView])

  const [locations, setLocations] = useState([])
  const [clusters, setClusters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchClusterAndLocationData() {
      if (bounds) {
        // Map has received real bounds
        setIsLoading(true)

        const query = {
          nelat: bounds.ne.lat,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          swlng: bounds.sw.lng,
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

  const handleViewChange = ({ center, zoom, bounds }) => {
    console.log('handleViewChange', center, zoom, bounds)
    const { nw: _nw, se: _se, ...necessaryBounds } = bounds
    setBounds(necessaryBounds)
    setView({
      center,
      zoom,
    })
  }

  const handleLocationClick = (location) => {
    // TODO: Fetch location data from server
    console.log('Location clicked: ', location.id)
  }

  const handleClusterClick = (cluster) => {
    setView(({ zoom: prevZoom }) => ({
      center: { lat: cluster.lat, lng: cluster.lng },
      zoom: prevZoom + 2,
    }))
  }

  return (
    <div style={{ width: '100%', height: '100%' }} ref={container}>
      {isLoading && <LoadingText>Loading...</LoadingText>}
      <Map
        googleMapsAPIKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        view={{ ...view, bounds }}
        locations={locations}
        clusters={clusters}
        onViewChange={handleViewChange}
        onLocationClick={handleLocationClick}
        onClusterClick={handleClusterClick}
      />
    </div>
  )
}

export default MapPage
