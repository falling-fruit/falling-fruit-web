import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components/macro'

import { CardTabs, Tab, TabList, TabPanel, TabPanels } from './CardTabs'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import Lightbox from './lightbox/Lightbox'

const ENTRY_IMAGE_HEIGHT = 250

const EntryLoading = () => (
  <article style={{ padding: '20px 23px', boxSizing: 'border-box' }}>
    <Skeleton
      height={14}
      width="70%"
      style={{ marginTop: '0.5em', marginBottom: '0.5em' }}
    />

    <Skeleton height={16} width="40%" style={{ marginBottom: '1.5em' }} />

    <Skeleton height={16} style={{ marginBottom: '0.5em' }} />
    <Skeleton height={16} style={{ marginBottom: '0.5em' }} />
    <Skeleton height={16} width="80%" style={{ marginBottom: '2em' }} />

    <Skeleton height={16} width="60%" style={{ marginBottom: '0.5em' }} />
    <Skeleton height={16} width="50%" style={{ marginBottom: '0.5em' }} />
  </article>
)

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const ImageBlock = styled.div`
  width: 100%;
  flex-shrink: 0;
`

const TextContent = styled.article`
  padding: 20px 23px;

  box-sizing: border-box;

  ul {
    margin-block: 0 12px;
    margin-inline: 0;
  }
`

/**
 * The persistent content tree shared by both the bottom-sheet and the
 * full-page shells. It is mounted once and never swapped, so the image
 * and tab state survive the mode change between sheet and page.
 *
 * It is a fill-height flex column: an optional fixed-height image block on
 * top, and the CardTabs (with its own internally-scrolling panels) filling
 * the remaining space. Both shells simply give it a box to fill; the content
 * itself never computes a viewport height.
 *
 * Layout differences between modes are expressed purely through props:
 * - hasImages: render the image carousel block (only when there are photos)
 * - showTabList: render the overview/reviews tab switcher (full page only)
 */
const LocationContent = ({
  isLoading,
  hasImages,
  hasReviews,
  showTabList,
  tabIndex,
  onTabChange,
  reviewCount,
}) => {
  const { t } = useTranslation()

  return (
    <ContentColumn>
      {hasImages && (
        <ImageBlock>
          {isLoading ? (
            <Skeleton height={ENTRY_IMAGE_HEIGHT} />
          ) : (
            <>
              <Lightbox />
              <Carousel />
            </>
          )}
        </ImageBlock>
      )}
      <CardTabs
        style={{ transition: 'none' }}
        onChange={onTabChange}
        index={tabIndex}
      >
        {showTabList && hasReviews && (
          <TabList>
            <Tab>{t('locations.overview.title')}</Tab>
            <Tab>{`${t('glossary.review.other')} (${reviewCount})`}</Tab>
          </TabList>
        )}
        <TabPanels style={{ background: 'white' }}>
          <TabPanel>
            {isLoading && <EntryLoading />}
            <TextContent>
              <EntryOverview />
            </TextContent>
          </TabPanel>
          <TabPanel>
            <TextContent>
              <EntryReviews />
            </TextContent>
          </TabPanel>
        </TabPanels>
      </CardTabs>
    </ContentColumn>
  )
}

export default LocationContent
