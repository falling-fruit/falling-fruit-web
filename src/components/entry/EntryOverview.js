import {
  Calendar,
  Data,
  EditAlt as Created,
  User,
} from '@styled-icons/boxicons-regular'
import { EditAlt, Map, User as UserYou } from '@styled-icons/boxicons-solid'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { MIN_LOCATION_ZOOM } from '../../constants/map'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop, useIsEmbed } from '../../utils/useBreakpoint'
import { theme } from '../ui/GlobalStyle'
import IconBesideText from '../ui/IconBesideText'
import {
  AddDescriptionHint,
  AddSeasonStartHint,
  AddSeasonStopHint,
  StaleLocationHintActions,
  StaleLocationHintToggle,
  UnverifiedHintActions,
  UnverifiedHintToggle,
} from './overview/Hints'
import { ReportButton } from './overview/ReportButton'
import SaveToListButton from './overview/SaveToListButton'
import StreetViewLink from './overview/StreetViewLink'
import Tags from './overview/Tags'
import TypesHeader from './overview/TypesHeader'
import { ReviewButton } from './ReviewButton'
import ReviewSummary from './ReviewSummary'
import { formatISOString, formatMonth } from './textFormatters'
import useLocationPane from './useLocationPane'

const TEN_YEARS_MS = 10 * 365.25 * 24 * 60 * 60 * 1000

const Description = styled.section`
  word-break: normal;
  overflow-wrap: anywhere;
  color: ${({ theme }) => theme.secondaryText};

  p {
    font-size: 1rem;
    /* Display line breaks in description */
    white-space: pre-line;
  }

  & > *:not(:first-child) {
    margin-block-start: 14px;
  }

  & > p:first-child {
    margin-block-end: 14px;
  }
`

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const ButtonGroupStart = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

const OverviewContainer = styled.div`
  padding-block-end: env(safe-area-inset-bottom, 0);
`

const AddressInfo = ({ locationData, onClick }) => (
  <IconBesideText bold onClick={onClick} tabIndex={0}>
    <Map color={theme.secondaryText} size={20} />
    <p dir="ltr">
      {locationData.address ??
        `${locationData.lat.toFixed(6)}, ${locationData.lng.toFixed(6)}`}
    </p>
  </IconBesideText>
)

const SeasonalityInfo = ({ locationData }) => {
  const { t, i18n } = useTranslation()
  return (
    <IconBesideText wrap>
      <Calendar color={theme.secondaryText} size={20} />
      <p>
        {locationData.season_start === 0 && locationData.season_stop === 11
          ? t('locations.overview.season.year_round')
          : t('locations.overview.season.in_season', {
              start_month:
                locationData.season_start != null
                  ? formatMonth(locationData.season_start, i18n.language)
                  : '?',
              stop_month:
                locationData.season_stop != null
                  ? formatMonth(locationData.season_stop, i18n.language)
                  : '?',
            })}
        {locationData.season_stop != null &&
          locationData.season_start == null && (
            <AddSeasonStartHint locationData={locationData} />
          )}
        {locationData.season_start != null &&
          locationData.season_stop == null && (
            <AddSeasonStopHint locationData={locationData} />
          )}
      </p>
    </IconBesideText>
  )
}

const ImportedByInfo = ({ locationData }) => {
  const { t } = useTranslation()
  return (
    <IconBesideText>
      <Data size={20} />
      <p>
        {locationData.author
          ? t('locations.overview.imported_from', { name: locationData.author })
          : null}
        {locationData.import_id && (
          <>
            {locationData.author && ' ('}
            <Link to={`/imports/${locationData.import_id}`}>
              #{locationData.import_id}
            </Link>
            {locationData.author && ')'}
          </>
        )}
      </p>
    </IconBesideText>
  )
}

const AddedByInfo = ({ locationData, user }) => {
  const { t } = useTranslation()
  const isCurrentUser = locationData.user_id === user?.id
  const displayName = locationData.author || `#${locationData.user_id}`
  return (
    <IconBesideText>
      {isCurrentUser ? <UserYou size={20} /> : <User size={20} />}
      <p>
        {isCurrentUser ? (
          t('locations.overview.added_by_you')
        ) : (
          <>
            {t('locations.overview.added_by', { name: '' })}{' '}
            {locationData.user_id ? (
              <Link to={`/users/${locationData.user_id}`}>{displayName}</Link>
            ) : (
              locationData.author
            )}
          </>
        )}
      </p>
    </IconBesideText>
  )
}

const AuthorInfo = ({ locationData, user }) =>
  locationData.import_id ? (
    <ImportedByInfo locationData={locationData} />
  ) : (
    <AddedByInfo locationData={locationData} user={user} />
  )

const LastEditedInfo = ({ locationData }) => {
  const { t, i18n } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const wasCreatedSameDay =
    locationData.created_at.slice(0, 10) ===
    locationData.updated_at.slice(0, 10)

  const icon = wasCreatedSameDay ? <Created size={20} /> : <EditAlt size={20} />

  const dateTime = wasCreatedSameDay
    ? locationData.created_at
    : locationData.updated_at

  const label = wasCreatedSameDay
    ? t('locations.overview.date_added', {
        date: formatISOString(locationData.created_at, i18n.language),
      })
    : t('locations.overview.date_last_updated', {
        date: formatISOString(locationData.updated_at, i18n.language),
      })

  const isStale =
    Date.now() - new Date(locationData.updated_at).getTime() > TEN_YEARS_MS

  return (
    <>
      <IconBesideText>
        {icon}
        <p>
          <time dateTime={dateTime}>{label}</time>
        </p>
        {isStale && (
          <StaleLocationHintToggle
            locationData={locationData}
            expanded={expanded}
            onToggle={() => setExpanded((prev) => !prev)}
          />
        )}
      </IconBesideText>
      {isStale && expanded && (
        <StaleLocationHintActions locationData={locationData} />
      )}
    </>
  )
}

const movePanoramaToFaceLocation = async (
  googleMap,
  getGoogleMaps,
  locationData,
) => {
  const googleMaps = getGoogleMaps()
  const panorama = googleMap.getStreetView()
  const panoClient = new googleMaps.StreetViewService()

  try {
    const panoData = await panoClient.getPanorama({
      location: { lat: locationData.lat, lng: locationData.lng },
      radius: 50,
    })
    const centerLatLng = new googleMaps.LatLng(
      locationData.lat,
      locationData.lng,
    )
    const panoLatLng = panoData.data.location.latLng
    const heading = googleMaps.geometry.spherical.computeHeading(
      panoLatLng,
      centerLatLng,
    )
    panorama.setPosition(panoLatLng)
    panorama.setPov({ heading, pitch: 0 })
  } catch {
    // ignored — no nearby panorama available
  }
}

const EntryOverview = () => {
  const typesAccess = useSelector((state) => state.type.typesAccess)
  const history = useAppHistory()
  const { googleMap, getGoogleMaps } = useSelector((state) => state.map)
  const { location: locationData, reviews } = useSelector(
    (state) => state.location,
  )
  const isEmbed = useIsEmbed()
  const streetViewOpen = useSelector((state) => state.panorama.streetViewOpen)
  const user = useSelector((state) => state.auth.user)
  const isDesktop = useIsDesktop()

  const {
    drawerFullyOpen,
    setPaneDrawerToLowPosition,
    setPaneDrawerToMiddlePosition,
  } = useLocationPane()

  const containerRef = useRef(null)
  const [unverifiedExpanded, setUnverifiedExpanded] = useState(false)

  if (!locationData) {
    return null
  }

  const types = locationData.type_ids
    .map((id) => typesAccess.getType(id))
    .filter(Boolean)

  const handleAddressClick = async () => {
    if (isEmbed) {
      history.pushAndChangeView('/map', {
        center: {
          lat: locationData.lat,
          lng: locationData.lng,
        },
        zoom: Math.max(googleMap?.getZoom(), MIN_LOCATION_ZOOM),
      })
      return
    }

    googleMap?.panTo({
      lat: locationData.lat,
      lng: locationData.lng,
    })
    if (googleMap?.getZoom() < MIN_LOCATION_ZOOM) {
      googleMap?.setZoom(MIN_LOCATION_ZOOM)
    }

    if (streetViewOpen && googleMap && getGoogleMaps) {
      await movePanoramaToFaceLocation(googleMap, getGoogleMaps, locationData)
    }

    if (drawerFullyOpen) {
      setPaneDrawerToLowPosition()
    }
  }

  return (
    <OverviewContainer ref={containerRef}>
      <TypesHeader types={types} openable={drawerFullyOpen || isDesktop} />
      <Tags locationData={locationData} />
      {locationData.unverified && (
        <UnverifiedHintToggle
          expanded={unverifiedExpanded}
          onToggle={() => setUnverifiedExpanded((prev) => !prev)}
        />
      )}
      {locationData.unverified && unverifiedExpanded && (
        <UnverifiedHintActions locationData={locationData} />
      )}
      <Description>
        <p dir="auto">
          {locationData.description || (
            <AddDescriptionHint locationData={locationData} />
          )}
        </p>
        <AddressInfo locationData={locationData} onClick={handleAddressClick} />
        <StreetViewLink
          lat={locationData.lat}
          lng={locationData.lng}
          locationId={locationData.id}
          setPaneDrawerToLowPosition={setPaneDrawerToLowPosition}
          setPaneDrawerToMiddlePosition={setPaneDrawerToMiddlePosition}
        />
        {!(
          locationData.season_start === null &&
          locationData.season_stop === null
        ) && <SeasonalityInfo locationData={locationData} />}
        {(locationData.import_id ||
          locationData.author ||
          locationData.user_id) && (
          <AuthorInfo locationData={locationData} user={user} />
        )}
        <LastEditedInfo locationData={locationData} />
        <ReviewSummary reviews={reviews} />
        <ButtonRow>
          <ButtonGroupStart>
            <ReviewButton />
            {user && <SaveToListButton containerRef={containerRef} />}
          </ButtonGroupStart>
          <ReportButton />
        </ButtonRow>
      </Description>
    </OverviewContainer>
  )
}

export default EntryOverview
