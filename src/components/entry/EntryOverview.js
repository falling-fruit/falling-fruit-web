import { Calendar } from '@styled-icons/boxicons-regular'
import { Flag, Map, Star } from '@styled-icons/boxicons-solid'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocationById, getTypeById } from '../../utils/api'
import { getStreetAddress, hasSeasonality } from '../../utils/locationInfo'
import { getZoomedInView } from '../../utils/viewportBounds'
import { ReportModal } from '../form/ReportModal'
import Button from '../ui/Button'
import { theme } from '../ui/GlobalStyle'
import LoadingIndicator from '../ui/LoadingIndicator'
import ResetButton from '../ui/ResetButton'
import { Tag, TagList } from '../ui/Tag'
import { TextContent } from './EntryTabs'
import PhotoGrid from './PhotoGrid'
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
  }

  button {
    margin-right: 14px;
  }
`

const EntryOverview = ({ className }) => {
  const { id } = useParams()
  const { setView } = useMap()
  const [locationData, setLocationData] = useState()
  const [address, setAddress] = useState('')
  const [typesData, setTypesData] = useState()
  const history = useHistory()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  useEffect(() => {
    async function fetchEntryDetails() {
      // Show loading between entry selections
      const locationData = await getLocationById(id)
      const streetAddress = await getStreetAddress(
        locationData.lat,
        locationData.lng,
      )

      const typesData = await Promise.all(
        locationData.type_ids.map(getTypeById),
      )

      setAddress(streetAddress)
      setLocationData(locationData)
      setTypesData(typesData)
    }
    fetchEntryDetails()
  }, [id])

  const handleAddressClick = () => {
    history.push('/map')
    setView(getZoomedInView(locationData.lat, locationData.lng))
  }

  const handleViewLightbox = () => {
    // TODO: connect to lightbox once implemented
    console.log('Open Image Slideshow/Lightbox')
  }

  const tagList = locationData && (
    <TagList>
      {locationData.access && (
        <Tag color={theme.tag.access}>{ACCESS_TYPE[locationData.access]}</Tag>
      )}
      {locationData.unverified ? (
        <Tag color={theme.tag.unverified}>Unverified</Tag>
      ) : (
        <Tag color={theme.tag.verified}>Verified</Tag>
      )}
    </TagList>
  )

  const allTypeNames = locationData && locationData.type_names.join(', ')
  const isReady = locationData && typesData

  return (
    <div className={className}>
      {/* Need to center this loading indicator!
       */}
      {isReady ? (
        <>
          <ReportModal
            locationId={locationData.id}
            name={allTypeNames}
            isOpen={isReportModalOpen}
            onDismiss={() => setIsReportModalOpen(false)}
          />
          <PhotoGrid
            photos={locationData.photos}
            altText={allTypeNames}
            handleViewLightbox={handleViewLightbox}
          />
          <TextContent>
            {tagList}
            <TypesHeader typesData={typesData} />
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
                Last Updated{' '}
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
