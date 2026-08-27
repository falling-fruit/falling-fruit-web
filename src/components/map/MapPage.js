import GoogleMapReact from 'google-map-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../../constants/map'
import { LabelVisibility, MapType, OverlayType } from '../../constants/settings'
import { fetchFilterCounts } from '../../redux/filterSlice'
import { setFromSettings } from '../../redux/locationSlice'
import { disconnectMap, setGoogle } from '../../redux/mapSlice'
import { fetchLocations } from '../../redux/viewChange'
import { updateLastMapView } from '../../redux/viewportSlice'
import { viewToString } from '../../utils/appUrl'
import throttle from '../../utils/throttle'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsEmbed } from '../../utils/useBreakpoint'
import Share from '../share/Share'
import ShareIconButton from '../share/ShareIconButton'
import { AddLocationMobile } from '../ui/AddLocation'
import LoadingIndicator from '../ui/LoadingIndicator'
import Cluster from './Cluster'
import DesktopCloseStreetView from './DesktopCloseStreetView'
import GeolocationDot from './GeolocationDot'
import LocationMarkers from './LocationMarkers'
import PanoramaEvents from './PanoramaEvents'
import PinMarkers from './PinMarkers'
import Place from './Place'
import TrackLocationButton from './TrackLocationButton'

const MIN_ZOOM = 1

const BottomLeftLoadingIndicator = styled(LoadingIndicator)`
  position: absolute;
  inset-inline-start: 10px;
  inset-block-end: 10px;
`

const ZoomButton = styled.button`
  position: absolute;
  inset-inline-start: 10px;
  width: 40px;
  height: 40px;
  background-color: white;
  color: ${({ theme }) => theme.headerText};
  ${({ isDesktop }) =>
    isDesktop &&
    `
    &:hover {
      background-color: #f0f0f0;
    }
  `}
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  z-index: 1;
  user-select: none;
`

const StyledIconButton = styled(ShareIconButton)`
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ccc;
  ${({ isDesktop }) =>
    isDesktop &&
    `
    &:hover {
      background-color: #f0f0f0;
    }
  `}
  svg {
    color: black;
  }
`

const ZoomInButton = styled(ZoomButton)`
  inset-block-start: calc(50% - 45px);
`

const ZoomOutButton = styled(ZoomButton)`
  inset-block-start: calc(50% + 5px);
`

const ShareContainer = styled.div`
  position: absolute;
  inset-block-start: 10px;
  inset-inline-end: 10px;
  background-color: white;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 1;
  width: 300px;
`

const EARTH_RADIUS = 6378137
const EARTH_CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS

const clusterBounds = ({ lat, lng, zoom }) => {
  const mercator = {
    x: (lng / 360) * EARTH_CIRCUMFERENCE,
    y: Math.log(Math.tan((lat + 90) * (Math.PI / 360))) * EARTH_RADIUS,
  }

  const cell_size = EARTH_CIRCUMFERENCE / 2 ** zoom
  const cell = {
    x: Math.floor((mercator.x + EARTH_CIRCUMFERENCE / 2) / cell_size),
    y: Math.floor((mercator.y + EARTH_CIRCUMFERENCE / 2) / cell_size),
  }

  const bounds = {
    south: cell.y * cell_size - EARTH_CIRCUMFERENCE / 2,
    west: cell.x * cell_size - EARTH_CIRCUMFERENCE / 2,
    north: (cell.y + 1) * cell_size - EARTH_CIRCUMFERENCE / 2,
    east: (cell.x + 1) * cell_size - EARTH_CIRCUMFERENCE / 2,
  }

  return {
    south:
      90 -
      (Math.atan2(1, Math.exp(bounds.south / EARTH_RADIUS)) * 360) / Math.PI,
    west: bounds.west * (360 / EARTH_CIRCUMFERENCE),
    north:
      90 -
      (Math.atan2(1, Math.exp(bounds.north / EARTH_RADIUS)) * 360) / Math.PI,
    east: bounds.east * (360 / EARTH_CIRCUMFERENCE),
  }
}

const isDegenerate = (bounds) => {
  const latSpan = Math.abs(bounds.north - bounds.south)
  const lngSpan = Math.abs(bounds.east - bounds.west)
  return latSpan < 1e-6 && lngSpan < 1e-6
}

const makeHandleViewChange = (dispatch, googleMap, history) => {
  const throttledDispatches = throttle((newView) => {
    dispatch(updateLastMapView(newView))
    dispatch(fetchLocations())
    dispatch(fetchFilterCounts())
  }, 1000)

  return () => {
    const center = googleMap.getCenter()
    const bounds = googleMap.getBounds().toJSON()

    if (isDegenerate(bounds)) {
      return
    }

    const newView = {
      center: { lat: center.lat(), lng: center.lng() },
      zoom: googleMap.getZoom(),
      bounds,
      width: googleMap.getDiv().offsetWidth,
      height: googleMap.getDiv().offsetHeight,
    }
    throttledDispatches(newView)
    history.syncViewToBrowserUrl(newView)
  }
}

function getTileCoordinates(coord, zoom) {
  const tilesPerGlobe = 1 << zoom
  let x = coord.x % tilesPerGlobe
  if (x < 0) {
    x = tilesPerGlobe + x
  }
  let y = coord.y
  if (coord.y < 0 || coord.y >= tilesPerGlobe) {
    y = null
  }
  return { x, y, z: zoom }
}

const configurePanoramaControls = (googleMap, showPegman, isDesktop) => {
  googleMap.setOptions({ streetViewControl: showPegman })

  const panorama = googleMap.getStreetView()
  if (panorama) {
    panorama.setOptions({
      fullscreenControl: false,
      enableCloseButton: !isDesktop,
      addressControl: false,
      motionTracking: false,
      motionTrackingControl: true,
    })
  }
}

const filterClustersAroundSelectedLocation = (clusters, selectedLocation) =>
  clusters.filter((cluster) => {
    if (
      selectedLocation &&
      cluster.count === 1 &&
      Math.abs(cluster.lat - selectedLocation.lat) < 1e-6 &&
      Math.abs(cluster.lng - selectedLocation.lng) < 1e-6
    ) {
      return false
    }
    return true
  })

const getVisibleLocations = (
  panoramaReady,
  panoramaLocations,
  clusters,
  locations,
  selectedLocation,
) => {
  if (panoramaReady) {
    return panoramaLocations
  }
  if (clusters.length !== 0) {
    return selectedLocation ? [selectedLocation] : []
  }
  if (selectedLocation) {
    return [...locations, selectedLocation].filter(
      (loc, index, self) => index === self.findIndex((t) => t.id === loc.id),
    )
  }
  return locations
}

const GoogleMapWrapper = ({ onUnmount, ...props }) => {
  useEffect(() => onUnmount, []) //eslint-disable-line

  return <GoogleMapReact {...props} />
}

const MapPage = ({ isDesktop }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const history = useAppHistory()
  const dispatch = useDispatch()
  const idleListenerRef = useRef(null)
  const mapClickListenerRef = useRef(null)

  const [shareOpen, setShareOpen] = useState(false)

  const {
    initialView,
    locations,
    clusters,
    isLoading: mapIsLoading,
    googleMap,
    getGoogleMaps,
  } = useSelector((state) => state.map)

  const currentZoom = googleMap?.getZoom()

  const {
    panoramaReady,
    streetViewOpen,
    locations: panoramaLocations,
  } = useSelector((state) => state.panorama)

  const place = useSelector((state) => state.place.selectedPlace)

  const { geolocation } = useSelector((state) => state.geolocation)
  const { pathname, search } = useLocation()
  const {
    locationId,
    isBeingEdited: isEditingLocation,
    location: selectedLocationRedux,
    isLoading: locationIsLoading,
    isBeingInitializedMobile,
  } = useSelector((state) => state.location)
  const { mapType, overlay, labelVisibility, showBusinesses } = useSelector(
    (state) => state.settings,
  )

  const selectedLocation =
    locations.find((l) => l.id === locationId) || selectedLocationRedux

  const layerTypes = overlay
    ? [OverlayType.toLayerType(overlay)].filter(Boolean)
    : []

  const { typesAccess } = useSelector((state) => state.type)

  const apiIsLoaded = (map, maps) => {
    /*
     * Something breaks when storing maps in redux so pass a reference to it
     */
    dispatch(setGoogle({ googleMap: map, getGoogleMaps: () => maps }))
  }

  const searchParams = new URLSearchParams(search)
  const hasTypesParams =
    searchParams.has('types') || searchParams.has('f') || searchParams.has('c')

  useEffect(() => {
    const ready =
      dispatch && !typesAccess.isEmpty && googleMap && !hasTypesParams
    if (!ready) {
      return
    }

    const handleViewChange = makeHandleViewChange(dispatch, googleMap, history)
    const google = getGoogleMaps()

    if (idleListenerRef.current) {
      google.event.removeListener(idleListenerRef.current)
    }
    idleListenerRef.current = google.event.addListener(
      googleMap,
      'idle',
      handleViewChange,
    )

    handleViewChange()
  }, [!typesAccess.isEmpty, googleMap, !!dispatch, hasTypesParams]) //eslint-disable-line

  const allClusters = filterClustersAroundSelectedLocation(
    clusters,
    selectedLocation,
  )
  const allLocations = getVisibleLocations(
    panoramaReady,
    panoramaLocations,
    clusters,
    locations,
    selectedLocation,
  )

  const isAddingLocation = locationId === 'new' || isBeingInitializedMobile
  const isViewingLocation =
    locationId !== null && !isEditingLocation && !isAddingLocation

  const showLabels =
    isAddingLocation ||
    isEditingLocation ||
    (panoramaReady
      ? labelVisibility !== LabelVisibility.Off
      : LabelVisibility.shouldShowLabels(labelVisibility, currentZoom))

  useEffect(() => {
    if (!googleMap) {
      return
    }
    const zoom = googleMap.getZoom()
    const zoomOk = zoom == null || zoom > VISIBLE_CLUSTER_ZOOM_LIMIT
    const showPegman = zoomOk
    configurePanoramaControls(googleMap, showPegman, isDesktop)
  }, [googleMap, currentZoom, isDesktop])

  const isEmbed = useIsEmbed()

  const handleClusterClick = (cluster) => {
    if (cluster.count === 1) {
      googleMap?.panTo({
        lat: cluster.lat,
        lng: cluster.lng,
      })
      googleMap?.setZoom(VISIBLE_CLUSTER_ZOOM_LIMIT + 1)
    } else {
      const bounds = clusterBounds({
        lat: cluster.lat,
        lng: cluster.lng,
        zoom: currentZoom + 1,
      })
      googleMap?.fitBounds(bounds)
    }
    if (isViewingLocation) {
      const center = googleMap.getCenter()
      const zoom = googleMap.getZoom()
      const viewString = viewToString(center.lat(), center.lng(), zoom)
      history.push(`/map/${viewString}`)
    }
  }

  const handleLocationClick = useCallback(
    (location) => {
      if (isEditingLocation || isAddingLocation) {
        return
      }
      if (isDesktop && pathname.includes('/settings')) {
        dispatch(setFromSettings(true))
      }
      history.push(`/locations/${location.id}?pane=&tab=`)
    },
    [
      isDesktop,
      pathname,
      dispatch,
      history,
      isEditingLocation,
      isAddingLocation,
    ],
  )

  useEffect(() => {
    if (!googleMap || !getGoogleMaps) {
      return
    }

    const google = getGoogleMaps()

    if (mapClickListenerRef.current) {
      google.event.removeListener(mapClickListenerRef.current)
    }

    mapClickListenerRef.current = google.event.addListener(
      googleMap,
      'click',
      () => {
        if (isViewingLocation) {
          history.push('/map?pane=&tab=')
        }
      },
    )

    return () => {
      if (mapClickListenerRef.current) {
        google.event.removeListener(mapClickListenerRef.current)
        mapClickListenerRef.current = null
      }
    }
  }, [googleMap, getGoogleMaps, isViewingLocation, history])

  const zoomIn = () => {
    if (googleMap) {
      googleMap.setZoom(googleMap.getZoom() + 1)
    }
  }
  const zoomOut = () => {
    if (googleMap) {
      googleMap.setZoom(googleMap.getZoom() - 1)
    }
  }

  const toggleShare = useCallback(() => {
    setShareOpen((prev) => !prev)
  }, [])

  return (
    <>
      {(mapIsLoading || locationIsLoading) && <BottomLeftLoadingIndicator />}
      {!isAddingLocation && !isEditingLocation && !isDesktop && !isEmbed && (
        <AddLocationMobile />
      )}
      {!isDesktop && !isEmbed && <TrackLocationButton isIcon />}

      <ZoomInButton
        onClick={zoomIn}
        disabled={!currentZoom || currentZoom >= MapType.getMaxZoom(mapType)}
        isDesktop={isDesktop}
      >
        +
      </ZoomInButton>
      <ZoomOutButton
        onClick={zoomOut}
        disabled={!currentZoom || currentZoom <= MIN_ZOOM}
        isDesktop={isDesktop}
      >
        -
      </ZoomOutButton>

      {isDesktop && (
        <>
          {shareOpen ? (
            <ShareContainer>
              <Share onClose={() => setShareOpen(false)} />
            </ShareContainer>
          ) : (
            <div
              style={{
                position: 'absolute',
                insetBlockStart: '10px',
                insetInlineEnd: '10px',
                zIndex: 1,
              }}
            >
              <StyledIconButton size={40} onClick={toggleShare} />
            </div>
          )}
        </>
      )}

      {googleMap && <PanoramaEvents />}
      {panoramaReady && isDesktop && <DesktopCloseStreetView />}

      {googleMap && getGoogleMaps && (
        <PinMarkers
          googleMap={googleMap}
          getGoogleMaps={getGoogleMaps}
          selectedLocationLat={selectedLocation?.lat}
          selectedLocationLng={selectedLocation?.lng}
          isEditing={isEditingLocation}
          isAdding={isAddingLocation}
          streetViewOpen={streetViewOpen}
        />
      )}

      {initialView && (
        <GoogleMapWrapper
          bootstrapURLKeys={{
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            version: 'quarterly',
            libraries: ['places'],
            language: i18n.language,
          }}
          options={(googleMaps) => ({
            mapTypeId: mapType,
            disableDefaultUI: true,
            streetViewControlOptions: {
              position: isRTL
                ? googleMaps.ControlPosition.RIGHT_BOTTOM
                : googleMaps.ControlPosition.LEFT_BOTTOM,
            },
            rotateControlOptions: {
              position: isRTL
                ? googleMaps.ControlPosition.RIGHT_BOTTOM
                : googleMaps.ControlPosition.LEFT_BOTTOM,
            },
            minZoom: MIN_ZOOM,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels.icon',
                stylers: [{ visibility: showBusinesses ? 'on' : 'off' }],
              },
              {
                featureType: 'landscape',
                elementType: 'labels.icon',
                stylers: [{ visibility: showBusinesses ? 'on' : 'off' }],
              },
            ],
          })}
          layerTypes={layerTypes}
          defaultCenter={initialView.center}
          defaultZoom={initialView.zoom}
          onGoogleApiLoaded={({ map, maps }) => {
            map.mapTypes.set(
              'osm-standard',
              new maps.ImageMapType({
                getTileUrl: (coord, zoom) => {
                  const { x, y, z } = getTileCoordinates(coord, zoom)
                  if (y !== null) {
                    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
                  }
                },
                tileSize: new maps.Size(256, 256),
                maxZoom: 19,
              }),
            )
            map.mapTypes.set(
              'osm-toner-lite',
              new maps.ImageMapType({
                getTileUrl: (coord, zoom) => {
                  const { x, y, z } = getTileCoordinates(coord, zoom)
                  if (y !== null) {
                    return `https://tiles.stadiamaps.com/tiles/stamen_toner-lite/${z}/${x}/${y}.png`
                  }
                },
                tileSize: new maps.Size(256, 256),
                maxZoom: 20,
              }),
            )
            apiIsLoaded(map, maps)
          }}
          yesIWantToUseGoogleMapApiInternals
          onUnmount={() => {
            if (idleListenerRef.current && getGoogleMaps) {
              getGoogleMaps().event.removeListener(idleListenerRef.current)
              idleListenerRef.current = null
            }
            dispatch(disconnectMap())
          }}
        >
          {geolocation && !geolocation.loading && !geolocation.error && (
            <GeolocationDot
              lat={geolocation.latitude}
              lng={geolocation.longitude}
            />
          )}
          {place &&
            place.location &&
            place.view &&
            place.view.zoom >= VISIBLE_CLUSTER_ZOOM_LIMIT &&
            currentZoom >= VISIBLE_CLUSTER_ZOOM_LIMIT && (
              <Place
                lat={place.location.lat}
                lng={place.location.lng}
                label={place.location.description}
              />
            )}
          {allClusters.map((cluster) => (
            <Cluster
              key={JSON.stringify(cluster)}
              onClick={(event) => {
                handleClusterClick(cluster)
                event.stopPropagation()
              }}
              count={cluster.count}
              lat={cluster.lat}
              lng={cluster.lng}
            />
          ))}
          <LocationMarkers
            locations={allLocations}
            googleMap={googleMap}
            getGoogleMaps={getGoogleMaps}
            onLocationClick={handleLocationClick}
            showLabels={showLabels}
          />
        </GoogleMapWrapper>
      )}
    </>
  )
}

export default MapPage
