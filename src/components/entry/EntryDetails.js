import { Flag, Star } from '@styled-icons/boxicons-solid'
import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getLocationById, getTypeById } from '../../utils/api'
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
  margin-top: 0px;
  padding-top: 0px;
  @media ${({ theme }) => theme.device.mobile} {
    margin-top: 110px;
    padding-top: 10px;
  }
  overflow: auto;
  width: 100%;
`

const TextContent = styled.article`
  padding: 23px;
  box-sizing: border-box;

  h3 {
    color: ${({ theme }) => theme.headerText};
  }

  a {
    font-size: 16px;
  }

  ul {
    margin-top: 0;
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

const EntryDetails = ({ isDesktop }) => {
  const {
    params: { id },
  } = useRouteMatch()

  const [locationData, setLocationData] = useState()
  const [typesData, setTypesData] = useState()

  useEffect(() => {
    async function fetchEntryDetails() {
      // Show loading between entry selections
      setLocationData(null)

      const locationData = await getLocationById(id)
      const typesData = await Promise.all(
        locationData.type_ids.map(getTypeById),
      )

      setLocationData(locationData)
      setTypesData(typesData)
    }
    fetchEntryDetails()
  }, [id])

  const _handleAddressClick = () => {
    // TODO: handle address click
    console.log('Map Button Clicked')
  }

  const handleViewLightbox = () => {
    // TODO: connect to lightbox once implemented
    console.log('Open Image Slideshow/Lightbox')
  }

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
    <Page isDesktop={isDesktop}>
      <PhotoGrid
        photos={locationData.photos}
        altText={locationData.type_names.join(', ')}
        handleViewLightbox={handleViewLightbox}
      />
      <TextContent>
        <TagList>
          {locationData.access && <Tag>{ACCESS_TYPE[locationData.access]}</Tag>}
          {/* TODO: Siraj - Put tag colors in theme/use constants somehow/map from object */}
          <Tag color={theme.blue} backgroundColor="#D9E6F3">
            {locationData.unverified ? 'Unverified' : 'Verified'}
          </Tag>
        </TagList>
        {typesHeader}
        <Description>
          <p>{locationData.description}</p>
          <small>Last Updated {formatISOString(locationData.updated_at)}</small>
          <Button>
            <Star /> Review
          </Button>
          <Button secondary>
            <Flag /> Report
          </Button>
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
