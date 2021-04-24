import { Calendar } from '@styled-icons/boxicons-regular'
import { Flag, Map, Star } from '@styled-icons/boxicons-solid'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocationById, getTypeById } from '../../utils/api'
import { getStreetAddress } from '../../utils/locationInfo'
import { getZoomedInView } from '../../utils/viewportBounds'
import Button from '../ui/Button'
import { theme } from '../ui/GlobalStyle'
import LoadingIndicator from '../ui/LoadingIndicator'
import ResetButton from '../ui/ResetButton'
import { Tag, TagList } from '../ui/Tag'
import TypeTitle from '../ui/TypeTitle'
import PhotoGrid from './PhotoGrid'
import ResourceList from './ResourceList'
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

// Wraps the entire page and gives it a top margin if on mobile
const Page = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    padding-top: 87px;
  }

  overflow: auto;
  width: 100%;
`

const TextContent = styled.article`
  padding: 20px 23px;

  @media ${({ theme }) => theme.device.desktop} {
    padding: 12px;
  }

  box-sizing: border-box;

  ul {
    margin: 0 0 12px 0;
  }
`

// Wraps description, last updated text, and review and report buttons
const Description = styled.section`
  & > *:not(:first-child) {
    margin-top: 14px;
  }

  & > p {
    color: ${({ theme }) => theme.secondaryText};
    margin-bottom: 14px;
  }

  small {
    display: block;
    font-style: italic;
  }

  button {
    margin-right: 14px;
  }
`

const EntryDetails = () => {
  const { id } = useParams()
  const { setView } = useMap()
  const [locationData, setLocationData] = useState()
  const [address, setAddress] = useState('')
  const [typesData, setTypesData] = useState()
  const history = useHistory()
  const hasSeasonality =
    locationData.no_season ||
    (locationData.season_start && locationData.season_stop)

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

  const typesHeader =
    typesData && typesData.length === 1 ? (
      <TypeTitle
        primaryText={typesData[0].en_name}
        secondaryText={typesData[0].scientific_name}
      />
    ) : (
      <TypesHeader typesData={typesData} />
    )

  // TypesHeader shows the resources if more than one type
  const otherResources = typesData && typesData.length === 1 && (
    <>
      <h3>Other Resources</h3>
      <ResourceList typeData={typesData[0]} />
    </>
  )

  return locationData && typesData ? (
    <Page>
      <PhotoGrid
        photos={locationData.photos}
        altText={locationData.type_names.join(', ')}
        handleViewLightbox={handleViewLightbox}
      />
      <TextContent>
        {tagList}
        {typesHeader}
        <Description>
          <p>{locationData.description}</p>
          <IconBesideText bold onClick={handleAddressClick} tabIndex={0}>
            <Map color={theme.secondaryText} size={20} />
            <LocationText>{address}</LocationText>
          </IconBesideText>
          {hasSeasonality && (
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
          <small>Last Updated {formatISOString(locationData.updated_at)}</small>
          <div>
            <Button>
              <Star /> Review
            </Button>
            <Button secondary>
              <Flag /> Report
            </Button>
          </div>
        </Description>
        {otherResources}
      </TextContent>
    </Page>
  ) : (
    <Page>
      <LoadingIndicator vertical cover />
    </Page>
  )
}

export default EntryDetails
