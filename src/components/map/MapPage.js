import { fitBounds } from 'google-map-react'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useGeolocation } from 'react-use'

import { useMap } from '../../contexts/MapContext'
import { useSearch } from '../../contexts/SearchContext'
import { useSettings } from '../../contexts/SettingsContext'
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
  const { viewport: searchViewport } = useSearch()
  const { view, setView } = useMap()
  const { filters } = useSearch()
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

  useEffect(() => {
    async function fetchClusterAndLocationData() {
      const { zoom, bounds } = view

      if (bounds?.ne.lat != null) {
        // Map has received real bounds
        setMapData((prevMapData) => ({ ...prevMapData, isLoading: true }))

        const query = {
          nelat: bounds.ne.lat,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          swlng: bounds.sw.lng,
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
          })

          setMapData({ locations, clusters: [], isLoading: false })
        }
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
      {mapData.isLoading && <LoadingIndicator />}
      <Map
        googleMapsAPIKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        view={view}
        geolocation={geolocation}
        locations={mapData.locations}
        clusters={mapData.clusters}
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
