import { fitBounds } from 'google-map-react'
import { eqBy, prop, unionWith } from 'ramda'
import { useEffect, useRef, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useGeolocation } from 'react-use'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { useSearch } from '../../contexts/SearchContext'
import { useSettings } from '../../contexts/SettingsContext'
import { getClusters, getLocations } from '../../utils/api'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import { useFilteredParams } from '../../utils/useFilteredParams'
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
export const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

/**
 * When user is adding a location, zoom in to this zoom level
 * @constant {number}
 */
const ADD_LOCATION_ZOOM = 18

const BottomLeftLoadingIndicator = styled(LoadingIndicator)`
  position: absolute;
  left: 10px;
  bottom: 10px;
`

const MapPage = ({ desktop }) => {
  const history = useHistory()
  const match = useRouteMatch({
    path: '/(map|list)/entry/:entryId',
    exact: true,
  })

  const isAddingLocation = match?.params.entryId === 'new'
  const entryId = match?.params.entryId && parseInt(match.params.entryId)

  const container = useRef(null)
  const { viewport: searchViewport, getTypeName } = useSearch()
  const {
    view,
    setView,
    hoveredLocationId,
    setHoveredLocationId,
    listLocations,
  } = useMap()
  // Need oldView to save the previous view before zooming into adding a location
  const oldView = useRef(null)
  const { settings } = useSettings()
  const getFilteredParams = useFilteredParams()

  const [mapData, setMapData] = useState({
    locations: [],
    clusters: [],
    isLoading: false,
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

  // TODO: get rid of useEffect by moving state into redux
  useEffect(() => {
    if (searchViewport) {
      setView(fitContainerBounds(searchViewport))
    }
  }, [searchViewport, setView])

  // TODO: same here
  useEffect(() => {
    if (isAddingLocation) {
      // Zoom into add location
      setView((prevView) => {
        oldView.current = prevView
        return {
          ...prevView,
          zoom: ADD_LOCATION_ZOOM,
          isAddingLocation: false,
        }
      })
    } else {
      // Restore the old view the user had before adding the location
      if (oldView.current) {
        setView(oldView.current)
      }
    }
  }, [isAddingLocation, setView])

  const handleViewChange = async (newView) => {
    setView(newView)

    if (isAddingLocation) {
      return
    }

    const { zoom, bounds } = newView

    if (bounds?.ne.lat != null) {
      // Map has received real bounds
      setMapData((prevMapData) => ({ ...prevMapData, isLoading: true }))

      const params = {
        limit: 250,
      }

      if (zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
        const clusters = await getClusters(
          getFilteredParams({ ...params, zoom }, false, newView),
        )

        setMapData({ locations: [], clusters, isLoading: false })
      } else {
        const locations = await getLocations(
          getFilteredParams(params, false, newView),
        )

        const locationsWithTypeNames = locations.map((location) => ({
          ...location,
          typeName: getTypeName(location.type_ids[0]),
        }))

        setMapData({
          locations: locationsWithTypeNames,
          clusters: [],
          isLoading: false,
        })
      }
    }
  }

  const handleGeolocationClick = () => {
    setView(getZoomedInView(geolocation.latitude, geolocation.longitude))
  }

  const handleLocationClick = (location) => {
    history.push({
      pathname: `/map/entry/${location.id}`,
      state: { fromPage: '/map' },
    })
    setHoveredLocationId(null)
  }

  const handleClusterClick = (cluster) => {
    setView(({ zoom: prevZoom }) => ({
      center: { lat: cluster.lat, lng: cluster.lng },
      zoom: prevZoom + 2,
    }))
  }

  const handleAddLocationClick = () => {
    history.push('/map/entry/new')
  }

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      ref={container}
    >
      {mapData.isLoading && <BottomLeftLoadingIndicator />}
      {isAddingLocation ? (
        <AddLocationPin />
      ) : (
        !desktop && <AddLocationButton onClick={handleAddLocationClick} />
      )}
      <Map
        bootstrapURLKeys={bootstrapURLKeys}
        view={view}
        geolocation={geolocation}
        locations={
          isAddingLocation
            ? []
            : unionWith(eqBy(prop('id')), mapData.locations, listLocations)
        }
        selectedLocationId={entryId}
        hoveredLocationId={hoveredLocationId}
        clusters={isAddingLocation ? [] : mapData.clusters}
        onViewChange={handleViewChange}
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
