import {
  Calendar,
  Data,
  EditAlt,
  StreetView,
  User,
} from '@styled-icons/boxicons-regular'
import { Flag, Map } from '@styled-icons/boxicons-solid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { css } from 'styled-components'
import styled from 'styled-components/macro'

import { MIN_LOCATION_ZOOM } from '../../constants/map'
import { partiallyClosePaneDrawer } from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { ReportModal } from '../form/ReportModal'
import Button from '../ui/Button'
import { theme } from '../ui/GlobalStyle'
import IconBesideText from '../ui/IconBesideText'
import { TextContent } from './Entry'
import EntryTags from './EntryTags'
import { ReviewButton } from './ReviewButton'
import { formatISOString, formatSeasonality } from './textFormatters'
import TypesHeader from './TypesHeader'

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
    margin-top: 14px;
  }

  & > p:first-child {
    margin-bottom: 14px;
  }

  button {
    margin-right: 10px;
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

const EntryOverview = () => {
  const typesAccess = useSelector((state) => state.type.typesAccess)
  const history = useAppHistory()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const { googleMap } = useSelector((state) => state.map)
  const {
    streetViewOpen,
    locationId,
    location: locationData,
    pane,
  } = useSelector((state) => state.location)
  const { locationsWithoutPanorama } = useSelector((state) => state.misc)
  const dispatch = useDispatch()

  const { t, i18n } = useTranslation()

  if (!locationData) {
    return null
  }

  const types = locationData.type_ids
    .map((id) => typesAccess.getType(id))
    .filter(Boolean)

  const handleAddressClick = () => {
    googleMap?.panTo({
      lat: locationData.lat,
      lng: locationData.lng,
    })
    if (googleMap?.getZoom() < MIN_LOCATION_ZOOM) {
      googleMap?.setZoom(MIN_LOCATION_ZOOM)
    }
    if (pane.drawerFullyOpen) {
      dispatch(partiallyClosePaneDrawer())
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
    <div>
      <>
        {isReportModalOpen && (
          <ReportModal
            locationId={locationData.id}
            name={locationData.type_ids
              .map((id) => typesAccess?.getType(id)?.commonName)
              .filter(Boolean)
              .join(', ')}
            onDismiss={() => setIsReportModalOpen(false)}
          />
        )}
        <TextContent>
          <TypesHeader types={types} />
          <EntryTags locationData={locationData} />
          <Description>
            <p>{locationData.description}</p>

            <IconBesideText bold onClick={handleAddressClick} tabIndex={0}>
              <Map color={theme.secondaryText} size={20} />
              <p>
                {locationData.address ??
                  `${locationData.lat.toFixed(6)}, ${locationData.lng.toFixed(
                    6,
                  )}`}
              </p>
            </IconBesideText>
            {streetViewOpen ? (
              <IconBesideText bold onClick={closeStreetView}>
                <Map size={20} />
                <p>Google Maps</p>
              </IconBesideText>
            ) : (
              <DisabledIconBesideText
                bold
                onClick={
                  locationsWithoutPanorama[locationData.id]
                    ? undefined
                    : openStreetView
                }
                disabled={locationsWithoutPanorama[locationData.id]}
              >
                <StreetView size={20} />
                <p>Google Street View</p>
              </DisabledIconBesideText>
            )}
            {hasSeasonality(locationData) && (
              <IconBesideText>
                <Calendar color={theme.secondaryText} size={20} />
                <p>
                  {formatSeasonality(
                    locationData.season_start,
                    locationData.season_stop,
                    locationData.no_season,
                  )}
                </p>
              </IconBesideText>
            )}
            {(locationData.import_id || locationData.author) && (
              <IconBesideText>
                {locationData.import_id ? (
                  <Data size={20} />
                ) : (
                  <User size={20} />
                )}
                <p>
                  {locationData.author && locationData.import_id ? (
                    t('imported_from', { name: locationData.author })
                  ) : (
                    <>
                      {t('added_by', { name: '' })}{' '}
                      <Link to={`/users/${locationData.user_id}`}>
                        {locationData.author}
                      </Link>
                    </>
                  )}
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
            )}
            <IconBesideText>
              <EditAlt size={20} />
              <p>
                <time dateTime={locationData.updated_at}>
                  {t('edited_on', {
                    date: formatISOString(
                      locationData.updated_at,
                      i18n.language,
                    ),
                  })}
                </time>
              </p>
            </IconBesideText>
            <div>
              <ReviewButton />
              <Button
                leftIcon={<Flag />}
                secondary
                onClick={() => setIsReportModalOpen(true)}
              >
                Report
              </Button>
            </div>
          </Description>
        </TextContent>
      </>
    </div>
  )
}
export default EntryOverview
