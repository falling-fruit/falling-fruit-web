import { ArrowBack, X } from '@styled-icons/boxicons-regular'
import GoogleMapReact from 'google-map-react'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { setStreetView } from '../../redux/mapSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'
import ResetButton from '../ui/ResetButton'
import Cluster from './Cluster'
import Geolocation from './Geolocation'
import Location from './Location'
/**
 * Wrapper component around google-map-react.
 * @param {string} apiKey - The google maps API key
 * @param {Object} view - The current view state
 * @param {Object[]} locations - The locations to display
 * @param {Object[]} clusters - The clusters to display
 * @param {function} onClusterClick - The function called when a cluster is clicked
 * @param {function} onLocationClick - The function called when a location is clicked
 * @param {function} onViewChange - The function called when the view state is changed
 * @param {boolean} showLabels - Will display labels under locations if true
 * @param {boolean} showBusinesses - Will display businesses in the map if true
 */

const OpacityButton = styled(ResetButton)`
  background: rgba(0, 0, 0, 0.65);
  padding: 15px;
  box-shadow: 0px 4px 4px ${({ theme }) => theme.shadow};
  color: #ffffff;
  z-index: 2;
  border-radius: 13.5px;
  font-size: 1.14rem;
  cursor: pointer;
  position: relative;
`

const StreetViewUIWrapper = styled.div`
  width: calc(100% - 40px);
  display: flex;
  top: 20px;
  left: 20px;
  justify-content: space-between;
  position: absolute;

  @media ${({ theme }) => theme.device.mobile} {
    top: 100px;
  }
`

const placeholderPlace = { lat: 40.729884, lng: -73.990988 }
const Map = ({
  bootstrapURLKeys,
  view,
  geolocation,
  locations,
  activeLocationId,
  clusters,
  onGeolocationClick,
  onClusterClick,
  onLocationClick,
  onViewChange,
  showLabels,
  mapType,
  layerTypes,
  showBusinesses,
  showStreetView,
}) => {
  const mapRef = useRef(null)
  const mapsRef = useRef(null)
  const locationMarkerRef = useRef(null)
  const dispatch = useDispatch()
  const mapLocation = useSelector((state) => state.map.location)
  const mapStreetView = useSelector((state) => state.map.streetView)
  const [headingStatus, setHeadingStatus] = useState(false)

  const setHeading = async (panoClient, markerLocation, panorama) => {
    try {
      // TODO!
      // Let's move all this logic to the entry page load and open a second
      // google map iframe/instance this way the map will be ready by the
      // time the user clicks on it and we can tell users whether or not its
      // available
      const pano = await panoClient.getPanorama({
        location: markerLocation,
        radius: 50,
      })

      const heading = mapsRef.current.geometry.spherical.computeHeading(
        pano.data.location.latLng,
        markerLocation,
      )

      panorama.setPov({
        heading: heading,
        pitch: 0,
      })
    } catch (error) {
      return false
    }

    return true
  }

  useEffect(() => {
    const setHeadingWrapper = async () => {
      if (mapRef.current) {
        const panorama = mapRef.current.getStreetView()
        const panoClient = new mapsRef.current.StreetViewService()
        if (mapLocation) {
          setHeadingStatus(await setHeading(panoClient, mapLocation, panorama))
        }
        if (headingStatus) {
          if (mapLocation) {
            if (showStreetView) {
              locationMarkerRef.current = new mapsRef.current.Marker({
                position: mapLocation,
                mapRef,
              })
              locationMarkerRef.current.setMap(panorama)
            }
            panorama.setPosition(mapLocation)
          } else {
            panorama.setPosition(placeholderPlace)
          }

          // TODO bottom minimap
          // panorama.controls[maps_state.current.ControlPosition.LEFT_BOTTOM].push(
          //   widget.current,
          // )
          if (showStreetView) {
            panorama.setOptions({
              disableDefaultUI: true,
              enableCloseButton: false,
            })
          } else {
            if (locationMarkerRef.current) {
              locationMarkerRef.current.setMap(null)
            }
          }
        }
        panorama.setVisible(showStreetView)
        if (panorama.visible && !headingStatus) {
          panorama.setVisible(!showStreetView)
          if (locationMarkerRef.current) {
            locationMarkerRef.current.setMap(null)
          }
        }
      }
    }
    setHeadingWrapper()
  }, [mapLocation, showStreetView, dispatch, mapStreetView, headingStatus])
  const apiIsLoaded = (map, maps) => {
    mapRef.current = map
    mapsRef.current = maps
  }

  const closeStreetView = () => {
    dispatch(setStreetView(false))
  }
  const isDesktop = useIsDesktop()

  return (
    <>
      {showStreetView && headingStatus && (
        <StreetViewUIWrapper>
          {isDesktop ? (
            <>
              <OpacityButton onClick={closeStreetView}>
                <ArrowBack height="18px" />
                Back to Map
              </OpacityButton>
              <OpacityButton onClick={closeStreetView}>
                <X height="22.91px" />
              </OpacityButton>
            </>
          ) : (
            <OpacityButton onClick={closeStreetView}>
              <ArrowBack height="18px" />
            </OpacityButton>
          )}
        </StreetViewUIWrapper>
      )}
      <GoogleMapReact
        bootstrapURLKeys={bootstrapURLKeys}
        options={() => ({
          mapTypeId: mapType,
          disableDefaultUI: true,
          // TODO: should we disable tilt?
          // tilt: 0,
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: showBusinesses ? 'on' : 'off' }],
            },
          ],
        })}
        layerTypes={layerTypes}
        center={view.center}
        zoom={view.zoom}
        onChange={onViewChange}
        resetBoundsOnResize
        onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
        yesIWantToUseGoogleMapApiInternals
      >
        {geolocation && !geolocation.loading && (
          <Geolocation
            onClick={onGeolocationClick}
            lat={geolocation.latitude}
            lng={geolocation.longitude}
            heading={geolocation.heading}
          />
        )}
        {clusters.map((cluster) => (
          <Cluster
            key={JSON.stringify(cluster)}
            onClick={(event) => {
              onClusterClick(cluster)
              event.stopPropagation()
            }}
            count={cluster.count}
            lat={cluster.lat}
            lng={cluster.lng}
          />
        ))}
        {locations.map((location) => (
          <Location
            key={location.id}
            onClick={(event) => {
              onLocationClick(location)
              event.stopPropagation()
            }}
            lat={location.lat}
            lng={location.lng}
            selected={location.id === activeLocationId}
            label={showLabels ? location.typeName : undefined}
          />
        ))}
      </GoogleMapReact>
    </>
  )
}

Map.propTypes = {
  bootstrapURLKeys: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  geolocation: PropTypes.object,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedLocationId: PropTypes.number,
  clusters: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewChange: PropTypes.func.isRequired,
  onClusterClick: PropTypes.func.isRequired,
  onLocationClick: PropTypes.func.isRequired,
  mapType: PropTypes.string,
  layerTypes: PropTypes.arrayOf(PropTypes.string),
  showLabels: PropTypes.bool,
  showBusinesses: PropTypes.bool,
}

export default Map
