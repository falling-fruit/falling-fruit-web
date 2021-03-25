import { Flag, Map, Star } from '@styled-icons/boxicons-solid'
import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ThemeContext } from 'styled-components'
import styled from 'styled-components/macro'

import { getLocationById, getTypeById } from '../../utils/api'
import Button from '../ui/Button'
import IconButton from '../ui/IconButton'
import LoadingIndicator from '../ui/LoadingIndicator'
import { Tag, TagList } from '../ui/Tag'
import PhotoGrid from './PhotoGrid'
import ResourceList from './ResourceList'

const ACCESS_TYPE = {
  0: "On lister's property",
  1: 'Received permission from owner',
  2: 'Public property',
  3: 'Private but overhanging',
  4: 'Private property',
}

const formatISOString = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

// TODO: Reduce number of styled components by using selectors in the container

// Wraps the entire page and gives it a top margin if on mobile
const Page = styled.div`
  margin-top: ${(props) => (props.isDesktop ? '0px' : '90px')};
  padding: 0;
  overflow: auto;
  width: 100%;
`

const TextContent = styled.article`
  padding: 23px;
  box-sizing: border-box;

  h2 {
    margin-top: 0px;
    margin-bottom: 0px;
    color: ${({ theme }) => theme.headerText};
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  small {
    font-size: 14px;
    font-style: italic;
  }

  h3 {
    color: ${({ theme }) => theme.headerText};
  }

  a {
    font-size: 16px;
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
  const themeContext = useContext(ThemeContext)

  const {
    params: { id },
  } = useRouteMatch()

  const [locationData, setLocationData] = useState()
  const [typeData, setTypeData] = useState()

  useEffect(() => {
    async function fetchEntryDetails() {
      // Show loading between type selections
      setLocationData(null)

      const locationData = await getLocationById(id)
      const typeData = await getTypeById(locationData.type_ids[0])

      setLocationData(locationData)
      setTypeData(typeData)
    }
    fetchEntryDetails()
  }, [id])

  const handleMapButtonClick = () => {
    // TODO: handle map button click
    console.log('Map Button Clicked')
  }

  const handleViewLightbox = () => {
    // TODO: connect to lightbox once implemented
    console.log('Open Image Slideshow/Lightbox')
  }

  return locationData && typeData ? (
    <Page isDesktop={isDesktop}>
      <PhotoGrid
        photos={locationData.photos}
        altText={locationData.type_names.join(', ')}
        handleViewLightbox={handleViewLightbox}
      />
      <TextContent>
        <header>
          <div>
            <h2>{locationData.type_names[0]}</h2>
            <small>{typeData.scientific_name}</small>
          </div>
          {isDesktop && (
            <IconButton
              size={40}
              raised={false}
              icon={<Map color={themeContext.secondaryText} />}
              onClick={handleMapButtonClick}
              label="add location"
            />
          )}
        </header>
        <TagList>
          {locationData.access && <Tag>{ACCESS_TYPE[locationData.access]}</Tag>}
          {/* TODO: Siraj - Put tag colors in theme/use constants somehow */}
          <Tag color="#4183C4" backgroundColor="#D9E6F3">
            {locationData.unverified ? 'Unverified' : 'Verified'}
          </Tag>
        </TagList>
        <Description>
          <p>{locationData.description}</p>
          <small>Last Updated {formatISOString(typeData.updated_at)}</small>
          <Button>
            <Star /> Review
          </Button>
          <Button secondary>
            <Flag /> Report
          </Button>
        </Description>

        <h3>Other Resources</h3>
        <ResourceList typeData={typeData} />
      </TextContent>
    </Page>
  ) : (
    <Page>
      <LoadingIndicator vertical cover />
    </Page>
  )
}

export default EntryDetails
