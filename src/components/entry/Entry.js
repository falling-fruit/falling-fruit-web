import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import LoadingIndicator, { LoadingOverlay } from '../ui/LoadingIndicator'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import Lightbox from './Lightbox'

export const TextContent = styled.article`
  padding: 20px 23px;

  @media ${({ theme }) => theme.device.desktop} {
    padding: 12px;
  }
  h2 {
    margin-top: 0;
    font-size: 1rem;
  }

  box-sizing: border-box;

  ul {
    margin: 0 0 12px 0;
  }
`

const Entry = () => {
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
      <EntryOverview />
      <EntryReviews />
      {isLoading && <LoadingOverlay />}
    </div>
  )
}

export default Entry
