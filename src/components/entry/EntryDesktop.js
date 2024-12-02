import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import LoadingIndicator, { LoadingOverlay } from '../ui/LoadingIndicator'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import Lightbox from './Lightbox'

const TextContent = styled.article`
  padding: 12px;

  h2 {
    margin-top: 0;
    font-size: 1rem;
  }

  box-sizing: border-box;

  ul {
    margin: 0 0 12px 0;
  }
`

const EntryDesktop = () => {
  const {
    location: locationData,
    reviews,
    isLoading,
  } = useSelector((state) => state.location)

  if (!locationData || !reviews) {
    return <LoadingIndicator cover vertical />
  }

  return (
    <div>
      <Lightbox />
      <Carousel />
      <TextContent>
        <EntryOverview />
      </TextContent>
      <TextContent>
        <EntryReviews />
      </TextContent>
      {isLoading && <LoadingOverlay />}
    </div>
  )
}

export default EntryDesktop
