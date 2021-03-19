import { Flag, Map, Star } from '@styled-icons/boxicons-solid'
import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'

import { getLocationById, getTypeById } from '../../utils/api'
import Button from '../ui/Button'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import { Tag, TagList } from '../ui/Tag'
import { RESOURCES } from './resources'

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
const EntryDetailsPageContainer = styled.div`
  margin-top: ${(props) => (props.isDesktop ? '0px' : '90px')};
`

const ImageContainer = styled.img`
  width: 100%;
`

// Wraps all text in the container
const EntryDetailsContent = styled.div`
  padding: 23px;
  box-sizing: border-box;
`

const PlantName = styled.h2`
  margin-top: 0px;
  margin-bottom: 0px;
  color: #333333;
`

const ScientificName = styled.small`
  font-style: italic;
`

// Wraps the plant name and scientific name, as well as an icon button for desktop
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

// Wraps description, last updated text, and review and report buttons
const DescriptionContainer = styled.section`
  & > *:not(:last-child) {
    margin-bottom: 14px;
  }
`

const Description = styled.p`
  color: #5a5a5a;
`

const UpdateText = styled.p`
  font-size: 14px;
  font-style: italic;
`

const ButtonSpacing = styled.div`
  button {
    margin-right: 14px;
  }
`

const ResourceHeader = styled.h3`
  color: #333333;
`

const ResourceLink = styled.a`
  font-size: 16px;
`

const ResourceImage = styled.img`
  height: 20px;
  width: 25px;
`

// Wraps all resource images and their links
const IndividualResourceContainer = styled.small`
  & > *:not(:last-child) {
    margin-bottom: 14px;
  }
  display: flex;
  column-count: 2;
  column-gap: 12px;
`

const EntryDetails = ({ isDesktop }) => {
  const {
    params: { id },
  } = useRouteMatch()

  const [locationData, setLocationData] = useState()
  const [locationTypeData, setLocationTypeData] = useState()

  useEffect(() => {
    async function fetchEntryDetails() {
      const locationData = await getLocationById(id)
      setLocationData(locationData)

      const locationTypeData = await getTypeById(locationData.type_ids[0])
      setLocationTypeData(locationTypeData)
    }
    fetchEntryDetails()
  }, [id])

  const handleMapButtonClick = () => {
    // TODO: handle map button click
    console.log('Map Button Clicked')
  }

  const resources = RESOURCES.map(
    ({ title, urlFormatter = (url) => url, urlKey, icon, iconAlt }) =>
      locationTypeData?.[urlKey] && (
        <IndividualResourceContainer>
          <ResourceImage src={icon} alt={iconAlt} />
          <ResourceLink
            target="_blank"
            rel="noopener noreferrer"
            href={urlFormatter(locationTypeData[urlKey])}
          >
            {title}
          </ResourceLink>
        </IndividualResourceContainer>
      ),
  )

  return locationData && locationTypeData ? (
    <EntryDetailsPageContainer isDesktop={isDesktop}>
      {locationData.photos.length > 0 && (
        // TODO: use alt based off of photo description or filename
        <ImageContainer
          src={locationData.photos[0].photo.original}
          alt="entry-details-photo"
        />
      )}

      <EntryDetailsContent>
        <HeaderContainer>
          <div>
            <PlantName>{locationData.type_names[0]}</PlantName>
            <ScientificName>{locationTypeData.scientific_name}</ScientificName>
          </div>
          {isDesktop && (
            <IconButton
              size={40}
              raised={false}
              icon={<Map color={theme.secondaryText} />}
              onClick={handleMapButtonClick}
              label="add location"
            />
          )}
        </HeaderContainer>
        <TagList>
          {locationData.access && <Tag>{ACCESS_TYPE[locationData.access]}</Tag>}
          {/* TODO: Put tag colors in theme/use constants somehow */}
          <Tag color="#4183C4" backgroundColor="#D9E6F3">
            {locationData.unverified ? 'Unverified' : 'Verified'}
          </Tag>
        </TagList>
        <DescriptionContainer>
          <Description>{locationData.description}</Description>

          <UpdateText>
            Last Updated {formatISOString(locationTypeData.updated_at)}
          </UpdateText>

          <ButtonSpacing>
            <Button>
              <Star /> Review
            </Button>
            <Button secondary>
              <Flag /> Report
            </Button>
          </ButtonSpacing>
        </DescriptionContainer>

        <ResourceHeader>Other Resources</ResourceHeader>

        {resources}
      </EntryDetailsContent>
    </EntryDetailsPageContainer>
  ) : (
    <EntryDetailsPageContainer>
      <p>Loading...</p>
    </EntryDetailsPageContainer>
  )
}

export default EntryDetails
