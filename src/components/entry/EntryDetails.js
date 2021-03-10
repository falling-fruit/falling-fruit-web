import { Flag, Star } from '@styled-icons/boxicons-solid'
import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'

import { getLocationById, getTypeById } from '../../utils/api'
import Button from '../ui/Button'
import { Tag } from '../ui/Tag'

function getAccessType(accessTypeNumber) {
  switch (accessTypeNumber) {
    case 0:
      return "On lister's property"
    case 1:
      return 'Received permission from owner'
    case 2:
      return 'Public property'
    case 3:
      return 'Private but overhanging'
    case 4:
      return 'Private property'
  }
}

// Just make width 100% and the height will automatically be fit
const ImageContainer = styled.img`
  width: 100%;
`

const TextContainer = styled.div`
  margin: 23px;
`

//I have no clue where the bottom margin was ever set to something other than 0, but it needs
const PlantName = styled.h2`
  margin-bottom: 0px;
  color: #333333;
`

const ScientificName = styled.small`
  font-style: italic;
`

const TagContainer = styled.div`
  margin-top: 12px;
`

/* Row gap nor line-height is working here to make the distance between all elements 14px
const DescriptionContainer = styled.div`
  grid-template-rows: 100%
  row-gap: 14px;
`
*/

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

const EntryDetails = () => {
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

  return locationData && locationTypeData ? (
    <div>
      <ImageContainer src={locationData.photos[0].photo.original} alt="" />

      <TextContainer>
        <div>
          <PlantName>{locationData.type_names[0]}</PlantName>
          <ScientificName>{locationTypeData.scientific_name}</ScientificName>
          <TagContainer>
            <Tag>{getAccessType(locationData.access)}</Tag>
          </TagContainer>
        </div>

        <>
          <Description>
            {console.log(locationData.address)}
            {locationData.description} @ {locationData.address}
          </Description>

          <UpdateText>Last Updated at {locationTypeData.updated_at}</UpdateText>

          <ButtonSpacing>
            <Button icon={<Star />}> Review </Button>
            <Button icon={<Flag />} secondary>
              {' '}
              Report{' '}
            </Button>
          </ButtonSpacing>
        </>

        <>
          <ResourceHeader>Other Resources</ResourceHeader>
          <IndividualResourceContainer>
            <Star height="20px" width="25px" />
            <a href={locationTypeData.wikipedia_url}>Wikipedia</a>
          </IndividualResourceContainer>
          <IndividualResourceContainer>
            <Flag height="20px" width="25px" />
            <a href={locationTypeData.eat_the_weeds_url}>Eat the Weeds</a>
          </IndividualResourceContainer>
        </>
        <p>EntryDetails for id: {id}</p>
      </TextContainer>
    </div>
  ) : (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <p>Loading...</p>
    </div>
  )
}

export default EntryDetails
