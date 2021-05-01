import { fitBounds } from 'google-map-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

/**
 * When user is adding a location, zoom in to this zoom level
 * @constant {number}
 */
const ADD_LOCATION_ZOOM = 18

/**
 * Normalize longitude to range [-180, 180].
 *
 * @param {number} longitude Longitude in degrees.
 * @returns Longitude in degrees in the range [-180, 180].
 */
const normalizeLongitude = (longitude) => {
  while (longitude < -180) {
    longitude += 360
  }
  while (longitude > 180) {
    longitude -= 360
  }
  return longitude
}

const MapPage = () => {
  const history = useHistory()
  const location = useLocation()
  const container = useRef(null)
  const { viewport: searchViewport, filters } = useSearch()
  const { view, setView } = useMap()
  const { i18n } = useTranslation()
  // Need oldView to save the previous view before zooming into adding a location
  const oldView = useRef(null)
  const { settings } = useSettings()

  const [mapData, setMapData] = useState({
    locations: [],
    clusters: [],
    isLoading: true,
  })

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
        setMapData((prevMapData) => ({ ...prevMapData, isLoading: true }))

        const query = {
          nelat: bounds.ne.lat,
          nelng: normalizeLongitude(bounds.ne.lng),
          swlat: bounds.sw.lat,
          swlng: normalizeLongitude(bounds.sw.lng),
          muni: filters.muni ? 1 : 0,
          t: filters.types.toString(),
          limit: 250,
        }

        if (view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
          const clusters = await getClusters({ ...query, zoom })

          setMapData({ locations: [], clusters, isLoading: false })
        } else {
          const [
            _numLocationsReturned,
            _totalLocations,
            ...locations
          ] = await getLocations({
            ...query,
            invasive: filters.invasive ? 1 : 0,
            locale: i18n.language === 'en-US' ? 'fr' : i18n.language,
          })

          setMapData({ locations, clusters: [], isLoading: false })
        }
      }
    }
    fetchClusterAndLocationData()
  }, [view, filters, i18n.language])

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
      {mapData.isLoading && <LoadingIndicator />}
      {isAddingLocation ? (
        <AddLocationPin />
      ) : (
        <AddLocationButton onClick={handleAddLocationClick} />
      )}
      <Map
        googleMapsAPIKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        view={view}
        geolocation={geolocation}
        locations={isAddingLocation ? [] : mapData.locations}
        clusters={isAddingLocation ? [] : mapData.clusters}
        onViewChange={setView}
        onGeolocationClick={handleGeolocationClick}
        onLocationClick={handleLocationClick}
        onClusterClick={handleClusterClick}
        mapType={settings.mapType}
        layerTypes={settings.mapLayers}
        showLabels={settings.showLabels}
      />
    </div>
  )
}

export default MapPage
