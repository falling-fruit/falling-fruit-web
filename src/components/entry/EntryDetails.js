import { Flag, ImageAdd, Map, Star } from '@styled-icons/boxicons-solid'
import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ThemeContext } from 'styled-components'
import styled from 'styled-components/macro'

import { getLocationById, getTypeById } from '../../utils/api'
import Button from '../ui/Button'
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
const Page = styled.div`
  margin-top: ${(props) => (props.isDesktop ? '0px' : '110px')};
  padding-top: ${(props) => (props.isDesktop ? '0px' : '10px')};
  overflow: auto;
`

const TextContent = styled.div`
  padding: 23px;
  box-sizing: border-box;

  h2 {
    margin-top: 0px;
    margin-bottom: 0px;
    color: #333333;
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
    color: #333333;
    // TODO: siraj - add this to theme?
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

// Wraps all resource images and their links
const Resource = styled.small`
  & > *:not(:last-child) {
    margin-bottom: 14px;
  }
  display: flex;
  column-count: 2;
  column-gap: 12px;

  img {
    height: 20px;
    width: 25px;
  }
`

const PhotoGrid = styled.figure`
  padding: 0;
  margin: 0 auto;
  height: 184px;
  width: calc(100% - 20px);

  display: grid;
  grid-template-columns: 1fr 92px;
  grid-template-rows: 50% 50%;
  gap: 6.5px;
  grid-template-areas:
    'main-image extra-image'
    'main-image add-more';

  .main-image {
    grid-area: main-image;
  }
  .extra-images {
    grid-area: extra-image;
  }
  .add-more {
    grid-area: add-more;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`

const ExtraImagesWrapper = styled.button`
  display: block;
  cursor: pointer;
  padding: 0;
  border: none;
  position: relative;
  border-radius: 4px;
  overflow: hidden;

  &:disabled {
    pointer-events: none;
  }

  & > img {
    left: 0;
    top: 0;
  }

  & > .other-photos-mask {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    color: white;
    background: linear-gradient(180deg, rgba(48, 45, 44, 0.4) 0%, #302d2c 100%);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-weight: 700;
    font-size: 13px;

    & > span {
      font-size: 24px;
    }
  }
`

const ImageUpload = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-weight: 13px;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 4px;
  border: 2px solid ${({ theme }) => theme.text};
  font-weight: 700;

  svg {
    width: 31px;
  }

  input {
    display: none;
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

  const resources = RESOURCES.map(
    ({ title, urlFormatter = (url) => url, urlKey, icon, iconAlt }) =>
      typeData?.[urlKey] && (
        <Resource key={urlKey}>
          <img src={icon} alt={iconAlt} />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={urlFormatter(typeData[urlKey])}
          >
            {title}
          </a>
        </Resource>
      ),
  )

  return locationData && typeData ? (
    <Page isDesktop={isDesktop}>
      {locationData.photos.length > 0 && (
        // TODO: extract PhotoGrid as its own component. Take an array of photos and single alt as prop.
        // TODO: use alt based off of photo description or filename
        <PhotoGrid>
          <img
            className="main-image"
            src={locationData.photos[0].photo.medium}
            alt={locationData.type_names.join(', ')}
          />
          {locationData.photos.length > 1 && (
            <ExtraImagesWrapper
              onClick={handleViewLightbox}
              disabled={locationData.photos.length < 3}
            >
              {locationData.photos.length > 2 && (
                <div className="other-photos-mask">
                  <span>{locationData.photos.length - 2}</span>
                  Photos
                </div>
              )}
              <img
                className="extra-images"
                src={locationData.photos[1].photo.medium}
                alt={locationData.type_names.join(', ')}
              />
            </ExtraImagesWrapper>
          )}
          <ImageUpload>
            <ImageAdd />
            Add Photo
            <input type="file" />
          </ImageUpload>
        </PhotoGrid>
      )}

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
        {resources}
      </TextContent>
    </Page>
  ) : (
    <Page>
      <p>Loading...</p>
    </Page>
  )
}

export default EntryDetails
