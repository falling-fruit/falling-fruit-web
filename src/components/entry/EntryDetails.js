/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Flag, Star } from '@styled-icons/boxicons-solid'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getLocationById, getTypeById } from '../../utils/api'
import { getStreetAddress } from '../../utils/locationInfo'
import SearchContext from '../search/SearchContext'
import Button from '../ui/Button'
import { theme } from '../ui/GlobalStyle'
import LoadingIndicator from '../ui/LoadingIndicator'
import { Tag, TagList } from '../ui/Tag'
import TypeTitle from '../ui/TypeTitle'
import PhotoGrid from './PhotoGrid'
import ResourceList from './ResourceList'
import TypesHeader from './TypesHeader'

const ACCESS_TYPE = {
  0: "On lister's property",
  1: 'Received permission from owner',
  2: 'Public property',
  3: 'Private but overhanging',
  4: 'Private property',
}

/**
 * Helper function to convert ISO date string into "month date, year" format.
 * @param {string} dateString - The ISO date to convert
 */
const formatISOString = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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
  & > *:not(:last-child) {
    margin-bottom: 14px;
  }

  p {
    color: ${({ theme }) => theme.secondaryText};
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

  const [locationData, setLocationData] = useState()
  const [address, setAddress] = useState('')
  const [typesData, setTypesData] = useState()
  const history = useHistory()

  const { setSelectedLocation } = useContext(SearchContext)

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
      // TODO: Make this it's own state
      setAddress(streetAddress)
      setLocationData(locationData)
      setTypesData(typesData)
    }
    fetchEntryDetails()
  }, [id])

  const _handleAddressClick = () => {
    // TODO: handle address click

    setSelectedLocation(locationData)
    history.push('/map')

    console.log('Map Button Clicked')
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
          {/* // eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <p onClick={_handleAddressClick}>{address}</p>
          <p>"Seasonality will go here"</p>
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
