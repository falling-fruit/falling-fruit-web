import { fitBounds } from 'google-map-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useGeolocation } from 'react-use'

import MapContext from '../../contexts/MapContext'
import SearchContext from '../../contexts/SearchContext'
import SettingsContext from '../../contexts/SettingsContext'
import { getClusters, getLocations } from '../../utils/api'
import { getGeolocationBounds } from '../../utils/viewportBounds'
import LoadingIndicator from '../ui/LoadingIndicator'
import Map from './Map'

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
  const { showLabels } = useContext(SettingsContext)

  const [locations, setLocations] = useState([])
  const [clusters, setClusters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  //const geolocation = useGeolocation({ enableHighAccuracy: true })
  const geolocation = useGeolocation()

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
          muni: filters.muni ? 1 : 0,
          t: filters.types.toString(),
        }

        if (view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
          const clusters = await getClusters({ ...query, zoom })

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
  }, [view, filters])

  const handleGeolocationClick = () => {
    setView(fitContainerBounds(getGeolocationBounds(geolocation)))
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
        geolocation={geolocation}
        locations={locations}
        clusters={clusters}
        onViewChange={setView}
        onGeolocationClick={handleGeolocationClick}
        onLocationClick={handleLocationClick}
        onClusterClick={handleClusterClick}
        showLabels={showLabels}
      />
    </div>
  )
}

export default MapPage
