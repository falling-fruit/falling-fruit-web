import styled from 'styled-components/macro'

import { EntryTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/EntryTabs'
import LoadingIndicator, { LoadingOverlay } from '../ui/LoadingIndicator'
import Carousel from './Carousel'
import EntryTags from './EntryTags'
import Lightbox from './Lightbox'

// Wraps the entire page and gives it a top margin if on mobile
export const Page = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    ${({ isInDrawer }) =>
      isInDrawer ? 'padding-bottom: inherit' : 'padding-top: 87px;'}
  }

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

const EntryTagsContainer = styled.div`
  @media ${({ theme }) => theme.device.desktop} {
    padding: 0 12px 0 12px;
    padding-top: ${({ showEntryImages }) => showEntryImages && `12px`};
  }

  @media ${({ theme }) => theme.device.mobile} {
    padding-left: 10px;
    padding-bottom: ${({ isFullScreen, showEntryImages }) =>
      isFullScreen && !showEntryImages && `16px`};
    padding-top: ${({ isFullScreen }) => !isFullScreen && `20px`};
    position: ${({ showEntryImages }) => showEntryImages && 'absolute'};
    top: ${({ isFullScreen }) => (isFullScreen ? '-30px' : '-50px')};
    position: fixed;
    transform: translateZ(0);
  }
`

const Entry = ({
  isInDrawer,
  locationData,
  reviews,
  isLoading,
  entryOverview,
  entryReviews,
  showTabs,
  showEntryImages,
  isLightboxOpen,
  setIsLightboxOpen,
  lightboxIndex,
  setLightboxIndex,
  isFullScreen,
}) => {
  let content

  if (!locationData || !reviews) {
    content = <LoadingIndicator cover vertical />
  } else {
    const allReviewPhotos = reviews.map((review) => review.photos).flat()
    const onClickCarousel = (idx) => {
      const targetId = allReviewPhotos[idx].id
      const reviewIdx = reviews.findIndex((review) =>
        review.photos.some((photo) => photo.id === targetId),
      )
      if (reviewIdx < 0) {
        return
      }
      const photoIdx = reviews[reviewIdx].photos.findIndex(
        (photo) => photo.id === targetId,
      )

      setLightboxIndex([reviewIdx, photoIdx])
      setIsLightboxOpen(true)
    }

    content = (
      <>
        {isLightboxOpen && reviews && (
          <Lightbox
            onDismiss={() => setIsLightboxOpen(false)}
            reviews={reviews ?? []}
            index={lightboxIndex}
            onIndexChange={setLightboxIndex}
          />
        )}
        {isInDrawer ? (
          <EntryTabs>
            <EntryTagsContainer
              isFullScreen={isFullScreen}
              showEntryImages={showEntryImages}
            >
              <EntryTags locationData={locationData} />
            </EntryTagsContainer>
            {showTabs && (
              <TabList>
                {/* TODO: Use Routing */}
                <Tab>Overview</Tab>
                <Tab>Reviews ({reviews.length})</Tab>
              </TabList>
            )}
            <TabPanels>
              <TabPanel>{entryOverview}</TabPanel>
              <TabPanel>{entryReviews}</TabPanel>
            </TabPanels>
          </EntryTabs>
        ) : (
          <>
            {allReviewPhotos.length > 0 && (
              <Carousel
                onClickItem={onClickCarousel}
                showIndicators={allReviewPhotos.length > 1}
              >
                {allReviewPhotos.map((photo) => (
                  <img key={photo.id} src={photo.medium} alt="entry" />
                ))}
              </Carousel>
            )}
            <EntryTagsContainer showEntryImages={showEntryImages}>
              <EntryTags locationData={locationData} />
            </EntryTagsContainer>
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
