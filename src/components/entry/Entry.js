import styled from 'styled-components/macro'

import { EntryTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/EntryTabs'
import LoadingIndicator, { LoadingOverlay } from '../ui/LoadingIndicator'
import ResetButton from '../ui/ResetButton'
import EntryTags from './EntryTags'
import Lightbox from './Lightbox'

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

const EntryTagsContainer = styled.div`
  @media ${({ theme }) => theme.device.desktop} {
    padding: 0 12px 0 12px;
    padding-top: ${({ showEntryImages }) => showEntryImages && `12px`};
  }

  @media ${({ theme }) => theme.device.mobile} {
    padding-left: 23px;
    padding-right: 23px;
    padding-bottom: ${({ isFullScreen, showEntryImages }) =>
      isFullScreen && !showEntryImages && `16px`};
    padding-top: ${({ isFullScreen }) => !isFullScreen && `20px`};
    position: ${({ showEntryImages }) => showEntryImages && 'absolute'};
    top: ${({ isFullScreen }) => (isFullScreen ? '-30px' : '-50px')};
  }
`

const Carousel = styled(ResetButton)`
  // TODO: to be changed to a real carousel
  width: 100%;
  cursor: pointer;
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
  console.log('here')
  console.log(showEntryImages)
  let content

  if (!locationData || !reviews) {
    content = <LoadingIndicator cover vertical />
  } else {
    const allReviewPhotos = reviews
      .filter((review) => review.photos.length > 0)
      .map((review) => review.photos)

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
                <Tab>Reviews</Tab>
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
              // TODO: Change to image carousel
              <Carousel onClick={() => setIsLightboxOpen(true)}>
                <img
                  style={{ width: '100%' }}
                  src={allReviewPhotos[0].medium}
                  alt="entry"
                />
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
