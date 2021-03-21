import { fitBounds } from 'google-map-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getClusters, getLocations } from '../../utils/api'
import SearchContext from '../search/SearchContext'
import Map from './Map'
import MapContext from './MapContext'

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

const MapPage = () => {
  const history = useHistory()
  const container = useRef(null)
  const { viewport: searchViewport } = useContext(SearchContext)
  const { view, setView } = useContext(MapContext)
  const { filters } = useContext(SearchContext)

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
      if (view.bounds?.ne.lat != null) {
        // Map has received real bounds
        setIsLoading(true)

        const query = {
          nelat: view.bounds.ne.lat,
          nelng: view.bounds.ne.lng,
          swlat: view.bounds.sw.lat,
          swlng: view.bounds.sw.lng,
          muni: filters.muni ? 1 : 0,
          t: `${filters.types}`,
        }

        if (view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
          const clusters = await getClusters({
            ...query,
            zoom: view.zoom,
          })

          setClusters(clusters)
          setLocations([])
        } else {
          const [
            _numLocationsReturned,
            _totalLocations,
            ...locations
          ] = await getLocations({
            ...query,
            invasive: filters.invasive ? 1 : 0,
          })

          setLocations(locations)
          setClusters([])
        }

        setIsLoading(false)
      }
    }
    fetchClusterAndLocationData()
    // TODO: Need to debounce this so that the server doesn't get killed
    // See: https://usehooks.com/useDebounce/
  }, [view, filters])

  const handleViewChange = (view) => {
    console.log('handleViewChange', view)
    setView(view)
  }

  const handleLocationClick = (location) =>
    history.push(`/entry/${location.id}`)

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
