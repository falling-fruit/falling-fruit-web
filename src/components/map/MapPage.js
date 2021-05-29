import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useGeolocation } from 'react-use'
import styled from 'styled-components/macro'

import {
  clusterClick,
  restoreOldView,
  setHoveredLocationId,
  zoomIn,
  zoomInAndSave,
} from '../../redux/mapSlice'
import { useTypesById } from '../../redux/useTypesById'
import {
  allLocationsSelector,
  viewChangeAndFetch,
} from '../../redux/viewChange'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
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

  const { getCommonName } = useTypesById()
  const dispatch = useDispatch()
  const settings = useSelector((state) => state.settings)
  const view = useSelector((state) => state.map.view)
  const allLocations = useSelector(allLocationsSelector)
  const clusters = useSelector((state) => state.map.clusters)
  const isLoading = useSelector((state) => state.map.isLoading)
  const hoveredLocationId = useSelector((state) => state.map.hoveredLocationId)

  //const geolocation = useGeolocation({ enableHighAccuracy: true })
  const geolocation = useGeolocation()

  useEffect(() => {
    if (isAddingLocation) {
      dispatch(zoomInAndSave())
    } else {
      dispatch(restoreOldView())
    }
  }, [dispatch, isAddingLocation])

  const handleLocationClick = (location) => {
    history.push({
      pathname: `/map/entry/${location.id}`,
      state: { fromPage: '/map' },
    })
    dispatch(setHoveredLocationId(null))
  }

  const handleAddLocationClick = () => {
    history.push('/map/entry/new')
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isLoading && <BottomLeftLoadingIndicator />}
      {isAddingLocation ? (
        <AddLocationPin />
      ) : (
        !desktop && <AddLocationButton onClick={handleAddLocationClick} />
      )}
      <Map
        bootstrapURLKeys={bootstrapURLKeys}
        view={view}
        geolocation={geolocation}
        clusters={isAddingLocation ? [] : clusters}
        locations={
          isAddingLocation
            ? []
            : allLocations.map((location) => ({
                ...location,
                typeName: getCommonName(location.type_ids[0]),
              }))
        }
        selectedLocationId={entryId}
        hoveredLocationId={hoveredLocationId}
        onViewChange={(newView) => dispatch(viewChangeAndFetch(newView))}
        onGeolocationClick={() => {
          dispatch(
            zoomIn({ lat: geolocation.latitude, lng: geolocation.longitude }),
          )
        }}
        onLocationClick={handleLocationClick}
        onClusterClick={(cluster) => dispatch(clusterClick(cluster))}
        mapType={settings.mapType}
        layerTypes={settings.mapLayers}
        showLabels={settings.showLabels}
      />
    </div>
  )
}

export default MapPage
