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
import styled from 'styled-components/macro'

import { setStreetView, zoomIn } from '../../redux/mapSlice'
import { useTypesById } from '../../redux/useTypesById'
import { hasSeasonality } from '../../utils/locationInfo'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { ReportModal } from '../form/ReportModal'
import Button from '../ui/Button'
import { theme } from '../ui/GlobalStyle'
import { LoadingOverlay } from '../ui/LoadingIndicator'
import { TextContent } from './Entry'
import { ReviewButton } from './ReviewButton'
import { formatISOString, formatSeasonality } from './textFormatters'
import TypesHeader from './TypesHeader'

// TODO: Move to its own file
const IconBesideText = styled.div`
  display: flex;
  color: ${({ theme }) => theme.secondaryText};
  font-style: normal;
  font-weight: ${($props) => ($props.bold ? 'bold' : 'normal')};
  align-items: center;

  ${'' /* TODO: Add another wrapper */}
  & + & {
    margin-top: 4px !important;
  }

  p {
    margin: 0 0 0 4px;
    font-size: 0.875rem;
  }

  ${($props) =>
    $props.onClick &&
    `
  cursor: pointer;
  `};
`

// Wraps description, last updated text, and review and report buttons
const Description = styled.section`
  white-space: pre-line;
  word-break: normal;
  overflow-wrap: anywhere;

  p {
    font-size: 1rem;
  }

  & > *:not(:first-child) {
    margin-top: 14px;
  }

  & > p:first-child {
    color: ${({ theme }) => theme.secondaryText};
    margin-bottom: 14px;
  }

  button {
    margin-right: 10px;
  }
`

const EntryOverview = ({ locationData, className }) => {
  const isDesktop = useIsDesktop()
  const { getLocationTypes } = useTypesById()
  const history = useAppHistory()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const dispatch = useDispatch()
  const currentStreetView = useSelector((state) => state.map.streetView)

  const { t, i18n } = useTranslation()

  const handleAddressClick = () => {
    dispatch(
      zoomIn({
        lat: locationData.lat,
        lng: locationData.lng,
      }),
    )
  }

  const handleStreetView = (event) => {
    event.stopPropagation()
    if (!isDesktop) {
      history.push(`/locations/${locationData.id}`, { fromPage: '/map' })
    }

    // TODO: change setTimeout to make it wait for map component to mount
    setTimeout(() => dispatch(setStreetView(!currentStreetView)), 200)
  }

  return (
    <div className={className}>
      <>
        {isReportModalOpen && (
          <ReportModal
            locationId={locationData.id}
            name={getLocationTypes(locationData)}
            onDismiss={() => setIsReportModalOpen(false)}
          />
        )}
        <TextContent>
          <TypesHeader typeIds={locationData.type_ids} />
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
            <IconBesideText bold onClick={handleStreetView}>
              <StreetView size={20} />
              <p>Google Street View</p>
            </IconBesideText>
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
                  {locationData.author && locationData.import_id
                    ? t('imported_from', { name: locationData.author })
                    : t('added_by', { name: locationData.author })}
                  {locationData.import_id && (
                    <>
                      {locationData.author && ' ('}
                      <Link
                        to={{
                          pathname: `/imports/${locationData.import_id}`,
                          state: { fromPage: `/locations/${locationData.id}` },
                        }}
                      >
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
      {!locationData && <LoadingOverlay />}
    </div>
  )
}
export { IconBesideText }
export default EntryOverview
