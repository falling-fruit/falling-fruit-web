import { Calendar } from '@styled-icons/boxicons-regular'
import { Flag, Map, Star } from '@styled-icons/boxicons-solid'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { useSearch } from '../../contexts/SearchContext'
import { getStreetAddress, hasSeasonality } from '../../utils/locationInfo'
import { getZoomedInView } from '../../utils/viewportBounds'
import { ReportModal } from '../form/ReportModal'
import Button from '../ui/Button'
import { theme } from '../ui/GlobalStyle'
import LoadingIndicator from '../ui/LoadingIndicator'
import ResetButton from '../ui/ResetButton'
import { Tag, TagList } from '../ui/Tag'
import { TextContent } from './Entry'
import {
  ACCESS_TYPE,
  formatISOString,
  formatSeasonality,
} from './textFormatters'
import TypesHeader from './TypesHeader'

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
    font-size: 14px;
  }
`
const LocationText = styled(ResetButton)`
  font-weight: bold;
  text-align: left;
  font-size: 14px;
  margin: 0 0 0 4px;
  flex: 1;
  color: ${({ theme }) => theme.secondaryText};
`

// Wraps description, last updated text, and review and report buttons
const Description = styled.section`
  & > *:not(:first-child) {
    margin-top: 14px;
  }

  & > p:first-child {
    color: ${({ theme }) => theme.secondaryText};
    margin-bottom: 14px;
  }

  & > .updatedTime {
    display: block;
    font-style: italic;
    color: ${({ theme }) => theme.text};
  }

  button {
    margin-right: 14px;
  }
`

const EntryOverview = ({ locationData, className }) => {
  const { setView } = useMap()
  const { typesById } = useSearch()
  const [address, setAddress] = useState('')
  const history = useHistory()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const { t } = useTranslation()

  useEffect(() => {
    // clear location data when id changes
    async function fetchStreetAddress() {
      // Show loading between entry selections
      const streetAddress = await getStreetAddress(
        locationData.lat,
        locationData.lng,
      )

      setAddress(streetAddress)
    }

    fetchStreetAddress()
  }, [locationData])

  const handleAddressClick = () => {
    history.push('/map')
    setView(getZoomedInView(locationData.lat, locationData.lng))
  }

  const tagList = locationData && (
    <TagList>
      {locationData.access && (
        <Tag color={theme.tag.access}>{ACCESS_TYPE[locationData.access]}</Tag>
      )}
      {locationData.unverified ? (
        <Tag color={theme.tag.unverified}>{t('Unverified')}</Tag>
      ) : (
        <Tag color={theme.tag.verified}>{t('Verified')}</Tag>
      )}
    </TagList>
  )

  const allTypeNames = locationData && locationData.type_names.join(', ')

  return (
    <div className={className}>
      {/* TODO: Properly center this loading indicator! */}

      {locationData ? (
        <>
          {isReportModalOpen && (
            <ReportModal
              locationId={locationData.id}
              name={allTypeNames}
              onDismiss={() => setIsReportModalOpen(false)}
            />
          )}
          <TextContent>
            {tagList}
            <TypesHeader
              typesData={locationData.type_ids.map(
                (typeId) => typesById[typeId],
              )}
            />
            <Description>
              <p>{locationData.description}</p>

              <IconBesideText bold onClick={handleAddressClick} tabIndex={0}>
                <Map color={theme.secondaryText} size={20} />
                <LocationText>{address}</LocationText>
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

              <p className="updatedTime">
                {t('Last Updated')}{' '}
                <time dateTime={locationData.updated_at}>
                  {formatISOString(locationData.updated_at)}
                </time>
              </p>

              <div>
                <Button leftIcon={<Star />}>Review</Button>
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
      ) : (
        <LoadingIndicator vertical cover />
      )}
    </div>
  )
}

export default EntryOverview
