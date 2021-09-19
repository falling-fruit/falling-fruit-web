import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import {
  clusterClick,
  restoreOldView,
  startTrackingLocation,
  zoomIn,
  zoomInAndSave,
} from '../../redux/mapSlice'
import { useTypesById } from '../../redux/useTypesById'
import { getAllLocations, viewChangeAndFetch } from '../../redux/viewChange'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import AddLocationButton from '../ui/AddLocationButton'
import AddLocationPin from '../ui/AddLocationPin'
import LoadingIndicator from '../ui/LoadingIndicator'
import TrackLocationButton from '../ui/TrackLocationButton'
import { ConnectedGeolocation } from './ConnectedGeolocation'
import Map from './Map'

const BottomLeftLoadingIndicator = styled(LoadingIndicator)`
  position: absolute;
  left: 10px;
  bottom: 10px;
`

const MapPage = ({ isDesktop }) => {
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
  const allLocations = useSelector(getAllLocations)
  const clusters = useSelector((state) => state.map.clusters)
  const isLoading = useSelector((state) => state.map.isLoading)
  const hoveredLocationId = useSelector((state) => state.map.hoveredLocationId)
  const geolocation = useSelector((state) => state.map.geolocation)
  const isTrackingLocation = useSelector(
    (state) => state.map.isTrackingLocation,
  )
  const [locationRequested, setLocationRequested] = useState(false)

  useEffect(() => {
    if (isAddingLocation) {
      dispatch(zoomInAndSave())
    } else {
      dispatch(restoreOldView())
    }
  }, [dispatch, isAddingLocation])

  const handleLocationClick = (location) =>
    history.push({
      pathname: `/map/entry/${location.id}`,
      state: { fromPage: '/map' },
    })

  const handleAddLocationClick = () => {
    history.push('/map/entry/new')
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isLoading && <BottomLeftLoadingIndicator />}
      {isAddingLocation ? (
        <AddLocationPin />
      ) : (
        !isDesktop && <AddLocationButton onClick={handleAddLocationClick} />
      )}
      {!isDesktop && (
        <TrackLocationButton
          $disabled={geolocation?.error}
          $loading={geolocation?.loading}
          $active={isTrackingLocation}
          onClick={() => {
            dispatch(startTrackingLocation())
            navigator.geolocation.getCurrentPosition(console.log)
            setLocationRequested(true)
          }}
        />
      )}

      {locationRequested && <ConnectedGeolocation />}

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
        activeLocationId={entryId || hoveredLocationId}
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
