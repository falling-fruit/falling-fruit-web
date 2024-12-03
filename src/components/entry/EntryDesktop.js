import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import LoadingIndicator, { LoadingOverlay } from '../ui/LoadingIndicator'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import LightboxDesktop from './LightboxDesktop'

const TextContent = styled.article`
  padding: 12px;

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
      <LightboxDesktop />
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
