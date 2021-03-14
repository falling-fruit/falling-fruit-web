import { Flag, Map, Star } from '@styled-icons/boxicons-solid'
import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'

import { getLocationById, getTypeById } from '../../utils/api'
import Button from '../ui/Button'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import { Tag } from '../ui/Tag'

const ACCESS_TYPE = {
  0: "On lister's property",
  1: 'Received permission from owner',
  2: 'Public property',
  3: 'Private but overhanging',
  4: 'Private property',
}

function parseISOString(dateString) {
  const date = new Date(dateString)
  // Unsure about time zones .getUTCOffset()?
  return `${date.toLocaleString('default', {
    month: 'long',
  })} ${date.getDay()}, ${date.getFullYear()}`
}

const EntryDetailsPageContainer = styled.div`
  overflow: scroll;
  margin-top: ${(props) => (props.isDesktop ? '0px' : '90px')};
`

const ImageContainer = styled.img`
  width: 100%;
`

const EntryDetailsContent = styled.div`
  margin: 23px;
`

const PlantName = styled.h2`
  margin-top: 0px;
  margin-bottom: 0px;
  color: #333333;
`

const ScientificName = styled.small`
  font-style: italic;
`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TagContainer = styled.div`
  margin-top: 12px;
`

const DescriptionContainer = styled.div`
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

const IndividualResourceContainer = styled.small`
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

  return locationData && locationTypeData ? (
    <EntryDetailsPageContainer isDesktop={isDesktop}>
      {locationData.photos.length > 0 && (
        <ImageContainer src={locationData.photos[0].photo.original} alt="" />
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
        <TagContainer>
          {locationData.access && <Tag>{ACCESS_TYPE[locationData.access]}</Tag>}
          <Tag color="#4183C4" backgroundColor="#D9E6F3">
            {locationData.unverified ? 'Unverified' : 'Verified'}
          </Tag>
        </TagContainer>
        <DescriptionContainer>
          <Description>
            {locationData.description} @ {locationData.address}
          </Description>

          <UpdateText>
            Last Updated {parseISOString(locationTypeData.updated_at)}
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
        <IndividualResourceContainer>
          <Star height="20px" width="25px" />
          <a href={locationTypeData.wikipedia_url}>Wikipedia</a>
        </IndividualResourceContainer>
        <IndividualResourceContainer>
          <Flag height="20px" width="25px" />
          <a href={locationTypeData.eat_the_weeds_url}>Eat the Weeds</a>
        </IndividualResourceContainer>
      </EntryDetailsContent>
    </EntryDetailsPageContainer>
  ) : (
    <EntryDetailsPageContainer>
      <p>Loading...</p>
    </EntryDetailsPageContainer>
  )
}

export default EntryDetails
