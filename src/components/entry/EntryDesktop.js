import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import LoadingIndicator, { LoadingOverlay } from '../ui/LoadingIndicator'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import Lightbox from './lightbox/Lightbox'

const TextContent = styled.article`
  padding: 12px;

  box-sizing: border-box;

  ul {
    margin-block: 0 12px;
    margin-inline: 0;
  }
`

const EntryDesktop = () => {
  const {
    location: locationData,
    reviews,
    isLoading,
  } = useSelector((state) => state.location)

  if (!locationData) {
    return <LoadingIndicator cover vertical />
  }

  return (
    <div>
      <Lightbox />
      <Carousel />
      <TextContent>
        <EntryOverview />
      </TextContent>
      {reviews.length > 0 && (
        <TextContent>
          <EntryReviews />
        </TextContent>
      )}
      {isLoading && <LoadingOverlay />}
    </div>
  )
}

export default EntryDesktop
