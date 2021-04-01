import { fitBounds } from 'google-map-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { getClusters, getLocations } from '../../utils/api'
import SearchContext from '../search/SearchContext'
import LoadingIndicator from '../ui/LoadingIndicator'
import Map from './Map'
import MapContext from './MapContext'

/**
 * Maximum zoom level at which clusters will be displayed. At zoom levels
 * greater than VISIBLE_CLUSTER_ZOOM_LIMIT, locations will be displayed.
 * @constant {number}
 */
const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

const MapPage = () => {
  const history = useHistory()
  const container = useRef(null)
  const { viewport: searchViewport } = useContext(SearchContext)
  const { view, setView } = useContext(MapContext)

  const [locations, setLocations] = useState([])
  const [clusters, setClusters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fitContainerBounds = (bounds) => {
    const { offsetWidth, offsetHeight } = container.current
    return fitBounds(bounds, {
      width: offsetWidth,
      height: offsetHeight,
    })
  }

  useEffect(() => {
    if (searchViewport) {
      setView(fitContainerBounds(searchViewport))
    }
  }, [searchViewport, setView])

  useEffect(() => {
    async function fetchClusterAndLocationData() {
      const { zoom, bounds } = view

      if (bounds?.ne.lat != null) {
        // Map has received real bounds
        setIsLoading(true)

        const query = {
          nelat: bounds.ne.lat,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          swlng: bounds.sw.lng,
          muni: 1,
        }

        if (zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
          const clusters = await getClusters({ ...query, zoom })

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
  }, [view])

  const handleViewChange = (view) => {
    console.log('handleViewChange', view)
    setView(view)
  }

  const handleLocationClick = (location) => {
    history.push({
      pathname: `/entry/${location.id}`,
      state: { fromPage: '/map' },
    })
  }

  const handleClusterClick = (cluster) => {
    setView(({ zoom: prevZoom }) => ({
      center: { lat: cluster.lat, lng: cluster.lng },
      zoom: prevZoom + 2,
    }))
  }

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      ref={container}
    >
      {isLoading && <LoadingIndicator />}
      <Map
        googleMapsAPIKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        view={view}
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
