import styled from 'styled-components/macro'

import { EntryTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/EntryTabs'
import LoadingIndicator, { LoadingOverlay } from '../ui/LoadingIndicator'
import EntryTags from './EntryTags'

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

const Entry = ({
  isInDrawer,
  locationData,
  reviews,
  isLoading,
  entryOverview,
  entryReviews,
  showTabs,
  showEntryImages,
  isFullScreen,
}) => {
  let content

  if (!locationData || !reviews) {
    content = <LoadingIndicator cover vertical />
  } else {
    const allReviewPhotos = reviews.map((review) => review.photos).flat()

    content = (
      <>
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
              <img
                style={{ width: '100%' }}
                src={allReviewPhotos[0].medium}
                alt="entry"
              />
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
