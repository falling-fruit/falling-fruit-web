import { Wikipedia } from '@styled-icons/boxicons-logos'
//import { Calendar } from '@styled-icons/boxicons-regular'
import { Flag, Map, Star } from '@styled-icons/boxicons-solid'
import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'

import { getLocationById, getTypeById } from '../../utils/api'
import Button from '../ui/Button'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import { Tag } from '../ui/Tag'
import EatTheWeedsLogo from './EatTheWeeds.svg'
import ForagingTexasLogo from './ForagingTexas.png'
import FruitipediaLogo from './Fruitipedia.png'
import UrbanMushroomsLogo from './UrbanMushrooms.png'
import USDALogo from './USDA.svg'

const ACCESS_TYPE = {
  0: "On lister's property",
  1: 'Received permission from owner',
  2: 'Public property',
  3: 'Private but overhanging',
  4: 'Private property',
}

const parseISOString = (dateString) => {
  const date = new Date(dateString)

  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const localeDateString = date.toLocaleDateString(undefined, options)

  return `${localeDateString}`
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

const ResourceLink = styled.a`
  font-size: 16px;
`

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
          <Description>{locationData.description}</Description>

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

        {locationTypeData.usda_symbol && (
          <IndividualResourceContainer>
            <img src={USDALogo} height="20px" width="25px" alt="USDA logo" />
            <ResourceLink href={locationTypeData.usda_symbol}>
              USDA
            </ResourceLink>
          </IndividualResourceContainer>
        )}

        {locationTypeData.wikipedia_url && (
          <IndividualResourceContainer>
            <Wikipedia height="20px" width="25px" />
            <ResourceLink href={locationTypeData.wikipedia_url}>
              Wikipedia
            </ResourceLink>
          </IndividualResourceContainer>
        )}

        {locationTypeData.eat_the_weeds_url && (
          <IndividualResourceContainer>
            <img
              src={EatTheWeedsLogo}
              height="20px"
              width="25px"
              alt="Eat the Weeds logo"
            />
            <ResourceLink href={locationTypeData.eat_the_weeds_url}>
              Eat the Weeds
            </ResourceLink>
          </IndividualResourceContainer>
        )}

        {locationTypeData.foraging_texas_url && (
          <IndividualResourceContainer>
            <img
              src={ForagingTexasLogo}
              height="20px"
              width="25px"
              alt="Foraging Texas logo"
            />
            <ResourceLink href={locationTypeData.foraging_texas_url}>
              Foraging Texas
            </ResourceLink>
          </IndividualResourceContainer>
        )}

        {locationTypeData.urban_mushrooms_url && (
          <IndividualResourceContainer>
            <img
              src={UrbanMushroomsLogo}
              height="20px"
              width="25px"
              alt="Urban Mushrooms logo"
            />
            <ResourceLink href={locationTypeData.urban_mushrooms_url}>
              Urban Mushrooms
            </ResourceLink>
          </IndividualResourceContainer>
        )}

        {locationTypeData.fruitipedia_url && (
          <IndividualResourceContainer>
            <img
              src={FruitipediaLogo}
              height="20px"
              width="25px"
              alt="Fruitipedia logo"
            />
            <ResourceLink href={locationTypeData.fruitipedia_url}>
              Fruitipedia
            </ResourceLink>
          </IndividualResourceContainer>
        )}
      </EntryDetailsContent>
    </EntryDetailsPageContainer>
  ) : (
    <EntryDetailsPageContainer>
      <p>Loading...</p>
    </EntryDetailsPageContainer>
  )
}

export default EntryDetails
