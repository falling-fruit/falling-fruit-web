import { Map, StreetView } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { css } from 'styled-components'
import styled from 'styled-components/macro'

import { MIN_LOCATION_ZOOM } from '../../../constants/map'
import { addLocationWithoutPanorama } from '../../../redux/panoramaSlice'
import IconBesideText from '../../ui/IconBesideText'

const StyledIconBesideText = styled(IconBesideText)`
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`

const StreetViewLink = ({
  lat,
  lng,
  locationId,
  setPaneDrawerToLowPosition,
  setPaneDrawerToMiddlePosition,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const googleMap = useSelector((state) => state.map.googleMap)
  const getGoogleMaps = useSelector((state) => state.map.getGoogleMaps)
  const googleMaps = getGoogleMaps ? getGoogleMaps() : null

  const isStreetViewOpen = useSelector((state) => state.panorama.streetViewOpen)
  const locationsWithoutPanorama = useSelector(
    (state) => state.panorama.locationsWithoutPanorama,
  )

  const noPanorama =
    locationId != null && locationsWithoutPanorama[locationId] === true

  const getPanorama = () => googleMap?.getStreetView?.() ?? null

  const handleOpen = async (event) => {
    event.stopPropagation()
    if (noPanorama) {
      return
    }
    const panorama = getPanorama()
    if (!panorama || !googleMaps) {
      return
    }

    const panoClient = new googleMaps.StreetViewService()
    let panoData
    try {
      panoData = await panoClient.getPanorama({
        location: { lat, lng },
        radius: 50,
      })
    } catch {
      dispatch(addLocationWithoutPanorama(locationId))
      return
    }

    const centerLatLng = new googleMaps.LatLng(lat, lng)
    const panoLatLng = panoData.data.location.latLng
    const heading = googleMaps.geometry.spherical.computeHeading(
      panoLatLng,
      centerLatLng,
    )

    panorama.setPosition(panoLatLng)
    panorama.setPov({ heading, pitch: 0 })
    panorama.setVisible(true)
    setPaneDrawerToLowPosition()
  }

  const handleClose = (event) => {
    event.stopPropagation()
    const panorama = getPanorama()
    if (!panorama) {
      return
    }
    panorama.setVisible(false)

    googleMap?.panTo({ lat, lng })
    if (googleMap?.getZoom() < MIN_LOCATION_ZOOM) {
      googleMap?.setZoom(MIN_LOCATION_ZOOM)
    }

    setPaneDrawerToMiddlePosition()
  }

  if (isStreetViewOpen) {
    return (
      <IconBesideText bold onClick={handleClose} tabIndex={0}>
        <Map size={20} />
        <p>Google Maps</p>
      </IconBesideText>
    )
  }

  return (
    <StyledIconBesideText
      bold
      onClick={noPanorama ? undefined : handleOpen}
      $disabled={noPanorama}
      tabIndex={noPanorama ? undefined : 0}
      title={
        noPanorama ? t('locations.overview.street_view_unavailable') : undefined
      }
    >
      <StreetView size={20} />
      <p>Google Street View</p>
    </StyledIconBesideText>
  )
}

export default StreetViewLink
