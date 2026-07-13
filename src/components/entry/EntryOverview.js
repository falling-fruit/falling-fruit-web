import {
  Calendar,
  Data,
  EditAlt as Created,
  StreetView,
  User,
} from '@styled-icons/boxicons-regular'
import { EditAlt, Map, User as UserYou } from '@styled-icons/boxicons-solid'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { css } from 'styled-components'
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
} from './overview/Hints'
import { ReportButton } from './overview/ReportButton'
import SaveToListButton from './overview/SaveToListButton'
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

const DisabledIconBesideText = styled(IconBesideText)`
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
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

const StreetViewInfo = () => {
  const history = useAppHistory()
  const {
    streetViewOpen,
    locationId,
    location: locationData,
  } = useSelector((state) => state.location)
  const { locationsWithoutPanorama } = useSelector((state) => state.misc)

  const isDisabled = !!locationsWithoutPanorama[locationData.id]

  const onOpen = (event) => {
    event.stopPropagation()
    history.push(`/locations/${locationId}/panorama`)
  }

  const onClose = (event) => {
    event.stopPropagation()
    history.push(`/locations/${locationId}`)
  }

  return streetViewOpen ? (
    <IconBesideText bold onClick={onClose}>
      <Map size={20} />
      <p>Google Maps</p>
    </IconBesideText>
  ) : (
    <DisabledIconBesideText
      bold
      onClick={isDisabled ? undefined : onOpen}
      disabled={isDisabled}
    >
      <StreetView size={20} />
      <p>Google Street View</p>
    </DisabledIconBesideText>
  )
}

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

const EntryOverview = () => {
  const typesAccess = useSelector((state) => state.type.typesAccess)
  const history = useAppHistory()
  const { googleMap } = useSelector((state) => state.map)
  const { location: locationData, reviews } = useSelector(
    (state) => state.location,
  )
  const isEmbed = useIsEmbed()
  const user = useSelector((state) => state.auth.user)
  const isDesktop = useIsDesktop()

  const { drawerFullyOpen, setPaneDrawerToLowPosition } = useLocationPane()

  const containerRef = useRef(null)

  if (!locationData) {
    return null
  }

  const types = locationData.type_ids
    .map((id) => typesAccess.getType(id))
    .filter(Boolean)

  const handleAddressClick = () => {
    if (isEmbed) {
      history.pushAndChangeView('/map', {
        center: {
          lat: locationData.lat,
          lng: locationData.lng,
        },
        zoom: Math.max(googleMap?.getZoom(), MIN_LOCATION_ZOOM),
      })
    } else {
      googleMap?.panTo({
        lat: locationData.lat,
        lng: locationData.lng,
      })
      if (googleMap?.getZoom() < MIN_LOCATION_ZOOM) {
        googleMap?.setZoom(MIN_LOCATION_ZOOM)
      } else if (drawerFullyOpen) {
        setPaneDrawerToLowPosition()
      }
    }
  }

  return (
    <OverviewContainer ref={containerRef}>
      <TypesHeader types={types} openable={drawerFullyOpen || isDesktop} />
      <Tags locationData={locationData} />
      <Description>
        <p dir="auto">
          {locationData.description || (
            <AddDescriptionHint locationData={locationData} />
          )}
        </p>
        <AddressInfo locationData={locationData} onClick={handleAddressClick} />
        <StreetViewInfo />
        {!!(
          locationData.season_start != null || locationData.season_stop != null
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
