import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getLocationById } from '../../utils/api'
import { EntryTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/EntryTabs'
import LoadingIndicator, { LoadingOverlay } from '../ui/LoadingIndicator'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import Lightbox from './Lightbox'
import PhotoGrid from './PhotoGrid'

// Wraps the entire page and gives it a top margin if on mobile
export const Page = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    ${({ isInDrawer }) =>
      isInDrawer ? 'padding-bottom: 27px' : 'padding-top: 87px;'}
  }

  overflow: auto;
  width: 100%;
`

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

const Entry = ({ isInDrawer }) => {
  const [locationData, setLocationData] = useState()
  const [reviews, setReviews] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [showLighbox, setShowLightbox] = useState(false)
  const [reviewImages, setReviewImages] = useState([])
  const [currReviewIndex, setCurrReviewIndex] = useState([0, 0])

  const openLightbox = (photos) => {
    setReviewImages(photos)
    setShowLightbox(true)
  }

  const closeLightbox = () => setShowLightbox(false)

  const { id } = useParams()

  useEffect(() => {
    async function fetchEntryData() {
      setIsLoading(true)

      const locationData = await getLocationById(id, 'reviews')
      setLocationData(locationData)
      setReviews(locationData.reviews)

      setIsLoading(false)
    }

    fetchEntryData()
  }, [id])

  const addSubmittedReview = (submittedReview) => {
    setReviews((reviews) => [...reviews, submittedReview])
  }

  const entryOverview = <EntryOverview locationData={locationData} />
  const entryReviews = (
    <EntryReviews reviews={reviews} onReviewSubmit={addSubmittedReview} />
  )

  let content

  if (!locationData || !reviews) {
    content = <LoadingIndicator cover vertical />
  } else {
    const allReviewPhotos = reviews
      .filter((review) => review.photos.length)
      .map((review) => review.photos)

    content = (
      <>
        <PhotoGrid
          photos={allReviewPhotos}
          altText={locationData.address}
          openLightbox={openLightbox}
        />
        {showLighbox && (
          <Lightbox
            onDismiss={closeLightbox}
            review={reviews}
            reviewImages={reviewImages}
            currReviewIndex={currReviewIndex}
            setCurrReviewIndex={setCurrReviewIndex}
          />
        )}
        {isInDrawer ? (
          <EntryTabs>
            <TabList>
              {/* TODO: Use Routing */}
              <Tab>Overview</Tab>
              <Tab>Reviews</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>{entryOverview}</TabPanel>
              <TabPanel>{entryReviews}</TabPanel>
            </TabPanels>
          </EntryTabs>
        ) : (
          <>
            {entryOverview}
            {entryReviews}
          </>
        )}
        {isLoading && <LoadingOverlay />}
      </>
    )
  }

  return <Page isInDrawer={isInDrawer}>{content}</Page>
}

export default Entry
