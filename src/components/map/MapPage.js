import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import {
  clusterClick,
  restoreOldView,
  zoomIn,
  zoomInAndSave,
} from '../../redux/mapSlice'
import { useTypesById } from '../../redux/useTypesById'
import { getAllLocations, viewChangeAndFetch } from '../../redux/viewChange'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import AddLocationButton from '../ui/AddLocationButton'
import AddLocationPin from '../ui/AddLocationPin'
import LoadingIndicator from '../ui/LoadingIndicator'
import { ConnectedGeolocation } from './ConnectedGeolocation'
import Map from './Map'
import TrackLocationButton from './TrackLocationButton'

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
  const geocoordmatch = useRouteMatch({
    path: '/map/:geocoord',
    exact: true,
  })
  const floatRegex = /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/

  const isValidCoord = () => {
    if (!geocoordmatch?.params.geocoord) {
      return false
    }
    const param = geocoordmatch.params.geocoord
    //@lat,long,zoomz

    const values = param.substring(1, param.length - 1).split(',')
    return {
      valid:
        (param.match(/\,/g) || []).length === 2 &&
        param.charAt(0) === '@' &&
        param.charAt(param.length - 1) === 'z' &&
        floatRegex.test(values[0]) &&
        floatRegex.test(values[1]) &&
        floatRegex.test(values[2]) &&
        parseFloat(values[0]) >= -90 &&
        parseFloat(values[0]) <= 90 &&
        parseFloat(values[1]) >= -180 &&
        parseFloat(values[1]) <= 180 &&
        parseFloat(values[2]) > 1 &&
        parseFloat(values[2]) <= 21,
      lat: parseFloat(values[0]),
      lng: parseFloat(values[1]),
      zoom: parseFloat(values[2]),
    }
  }

  const isAddingLocation = match?.params.entryId === 'new'
  const entryId = match?.params.entryId && parseInt(match.params.entryId)

  const { getCommonName } = useTypesById()
  const dispatch = useDispatch()
  const settings = useSelector((state) => state.settings)
  const currentView = useSelector((state) => state.map.view)
  const allLocations = useSelector(getAllLocations)

  const isLoading = useSelector((state) => state.map.isLoading)
  const hoveredLocationId = useSelector((state) => state.map.hoveredLocationId)
  const geolocation = useSelector((state) => state.map.geolocation)
  const locationRequested = useSelector((state) => state.map.locationRequested)
  const getCoords = isValidCoord()
  if (getCoords.valid) {
    const setView = {
      center: { lat: getCoords.lat, lng: getCoords.lng },
      bounds: {
        ne: { lat: getCoords.lat + 0.1, lng: getCoords.lng + 0.1 },
        sw: { lat: getCoords.lat - 0.1, lng: getCoords.lng - 0.1 },
      },
      zoom: getCoords.zoom,
    }
    if (
      setView.center.lat !== currentView.center.lat ||
      setView.center.lng !== currentView.center.lng ||
      setView.center.zoom !== currentView.center.zoom
    ) {
      dispatch(viewChangeAndFetch(setView))
      history.push(`/map/@${getCoords.lat},${getCoords.lng},${getCoords.zoom}z`)
    }
  }
  const view = useSelector((state) => state.map.view)
  const clusters = useSelector((state) => state.map.clusters)
  //console.log(clusters)
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
      {!isDesktop && <TrackLocationButton isIcon />}

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
