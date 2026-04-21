import {
  Calendar,
  Data,
  StreetView,
  User,
} from '@styled-icons/boxicons-regular'
import { EditAlt, Map, User as UserYou } from '@styled-icons/boxicons-solid'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { css } from 'styled-components'
import styled from 'styled-components/macro'

import { MIN_LOCATION_ZOOM } from '../../constants/map'
import {
  reenablePaneDrawerAndSetToLowPosition,
  setPaneDrawerToLowPosition,
} from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop, useIsEmbed } from '../../utils/useBreakpoint'
import { theme } from '../ui/GlobalStyle'
import IconBesideText from '../ui/IconBesideText'
import { ReportButton } from './overview/ReportButton'
import SaveToListButton from './overview/SaveToListButton'
import Tags from './overview/Tags'
import TypesHeader from './overview/TypesHeader'
import { ReviewButton } from './ReviewButton'
import ReviewSummary from './ReviewSummary'
import { formatISOString, formatMonth } from './textFormatters'

const hasSeasonality = (locationData) =>
  !!(
    locationData.no_season != null ||
    locationData.season_start != null ||
    locationData.season_stop != null
  )

// Wraps description, last updated text, and review and report buttons
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

const AddressInfo = ({ locationData, onClick }) => (
  <IconBesideText bold onClick={onClick} tabIndex={0}>
    <Map color={theme.secondaryText} size={20} />
    <p dir="ltr">
      {locationData.address ??
        `${locationData.lat.toFixed(6)}, ${locationData.lng.toFixed(6)}`}
    </p>
  </IconBesideText>
)

const StreetViewInfo = ({ streetViewOpen, isDisabled, onOpen, onClose }) =>
  streetViewOpen ? (
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

const SeasonalityInfo = ({ locationData }) => {
  const { t, i18n } = useTranslation()
  return (
    <IconBesideText>
      <Calendar color={theme.secondaryText} size={20} />
      <p>
        {locationData.no_season ||
        (locationData.season_start === 0 && locationData.season_stop === 11)
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
  return (
    <IconBesideText>
      <EditAlt size={20} />
      <p>
        <time dateTime={locationData.updated_at}>
          {t('locations.overview.date_edited', {
            date: formatISOString(locationData.updated_at, i18n.language),
          })}
        </time>
      </p>
    </IconBesideText>
  )
}
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
  position: relative;
`

const EntryOverview = () => {
  const typesAccess = useSelector((state) => state.type.typesAccess)
  const history = useAppHistory()
  const { googleMap } = useSelector((state) => state.map)
  const {
    streetViewOpen,
    locationId,
    location: locationData,
    inList,
    pane,
    reviews,
  } = useSelector((state) => state.location)
  const isEmbed = useIsEmbed()
  const { locationsWithoutPanorama } = useSelector((state) => state.misc)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()

  const { t, i18n } = useTranslation()

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
      } else if (pane.isFromListLocations) {
        dispatch(reenablePaneDrawerAndSetToLowPosition())
      } else if (pane.drawerFullyOpen) {
        dispatch(setPaneDrawerToLowPosition())
      }
    }
  }

  const openStreetView = (event) => {
    event.stopPropagation()
    history.push(`/locations/${locationId}/panorama`)
  }
  const closeStreetView = (event) => {
    event.stopPropagation()
    history.push(`/locations/${locationId}`)
  }

  return (
    <OverviewContainer ref={containerRef}>
      <>
        <TypesHeader
          types={types}
          openable={pane.drawerFullyOpen || isDesktop}
        />
        <Tags locationData={locationData} />
        <Description>
          <p dir="auto">{locationData.description}</p>

          <AddressInfo
            locationData={locationData}
            onClick={handleAddressClick}
          />
          <StreetViewInfo
            streetViewOpen={streetViewOpen}
            isDisabled={!!locationsWithoutPanorama[locationData.id]}
            onOpen={openStreetView}
            onClose={closeStreetView}
          />
          {hasSeasonality(locationData) && (
            <SeasonalityInfo locationData={locationData} />
          )}
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
              {user && (
                <SaveToListButton
                  locationId={locationId}
                  isSavedToAny={inList}
                  containerRef={containerRef}
                />
              )}
            </ButtonGroupStart>
            <ReportButton />
          </ButtonRow>
        </Description>
      </>
    </OverviewContainer>
  )
}
export default EntryOverview
