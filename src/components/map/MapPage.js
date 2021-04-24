import { fitBounds } from 'google-map-react'
import { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useGeolocation } from 'react-use'

import { useMap } from '../../contexts/MapContext'
import { useSearch } from '../../contexts/SearchContext'
import { useSettings } from '../../contexts/SettingsContext'
import { getClusters, getLocations } from '../../utils/api'
import { getZoomedInView } from '../../utils/viewportBounds'
import AddLocationButton from '../ui/AddLocationButton'
import AddLocationPin from '../ui/AddLocationPin'
import LoadingIndicator from '../ui/LoadingIndicator'
import Map from './Map'

/**
 * Maximum zoom level at which clusters will be displayed. At zoom levels
 * greater than VISIBLE_CLUSTER_ZOOM_LIMIT, locations will be displayed.
 * @constant {number}
 */
const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

const ADD_LOCATION_ZOOM = 18

const MapPage = () => {
  const history = useHistory()
  const location = useLocation()
  const container = useRef(null)
  const { viewport: searchViewport, filters } = useSearch()
  const { view, setView } = useMap()
  const { settings } = useSettings()

  const oldView = useRef(null)
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

  const isAddingLocation = location.pathname === '/entry/new'

  useEffect(() => {
    if (isAddingLocation) {
      // Zoom into add location
      setView((prevView) => {
        oldView.current = prevView
        return {
          ...prevView,
          zoom: ADD_LOCATION_ZOOM,
        }
      })
    } else {
      // Restore the old view the user had before adding the location
      if (oldView.current) {
        setView(oldView.current)
      }
    }
  }, [isAddingLocation, setView])

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
    setView(getZoomedInView(geolocation.latitude, geolocation.longitude))
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

  const handleAddLocationClick = () => {
    history.push('/entry/new')
  }

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      ref={container}
    >
      {isLoading && <LoadingIndicator />}
      {isAddingLocation ? (
        <AddLocationPin />
      ) : (
        <AddLocationButton onClick={handleAddLocationClick} />
      )}
      <Map
        googleMapsAPIKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        view={view}
        geolocation={geolocation}
        locations={isAddingLocation ? [] : locations}
        clusters={isAddingLocation ? [] : clusters}
        onViewChange={setView}
        onGeolocationClick={handleGeolocationClick}
        onLocationClick={handleLocationClick}
        onClusterClick={handleClusterClick}
        showLabels={settings.showLabels}
      />
    </div>
  )
}

export default MapPage
