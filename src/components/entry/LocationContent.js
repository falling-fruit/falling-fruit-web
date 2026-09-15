import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components/macro'

import { TABS_HEIGHT_PX } from '../../constants/mobileLayout'
import { CardTabs, Tab, TabList, TabPanel, TabPanels } from './CardTabs'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import Lightbox from './lightbox/Lightbox'
import useLocationPane from './useLocationPane'

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
  overflow: ${({ sheetMode }) => (sheetMode ? 'visible' : 'hidden')};
`

// Full-page image block: a normal fixed-height block at the top of the flow.
const ImageBlock = styled.div`
  width: 100%;
  flex-shrink: 0;
`

/*
 * Sheet reveal: in the draggable sheet the image is pulled up out of the peek
 * as the sheet is lowered, so the overview leads the visible peek (matching the
 * deployed behaviour). It is absolutely positioned and translated by the drag
 * progress; a matching whitespace placeholder reserves the space that the tab
 * list will occupy once fully open.
 */
const RevealedImage = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  height: ${ENTRY_IMAGE_HEIGHT}px;
  transform: translateY(${({ progress }) => -progress * ENTRY_IMAGE_HEIGHT}px);
  transition: transform 0.15s linear;
  z-index: -1;
`

const WhitespacePlaceholder = styled.div`
  width: 100%;
  background: white;
  height: ${({ progress }) => progress * TABS_HEIGHT_PX}px;
  transition: transform 0.15s linear;
  ${({ hidden }) => hidden && `display: none;`}
`

/*
 * ScrollablePane layout has a translateY property, which can hide some of the
 * content in e.g. the reviews tab; as a workaround add an element with that
 * same height. Only needed in sheet reveal mode.
 */
const DummyScrollSpacer = styled.div`
  height: ${({ height }) => height}px;
`

const TextContent = styled.article`
  padding: 20px 23px;

  box-sizing: border-box;

  ul {
    margin-block: 0 12px;
    margin-inline: 0;
  }
`

const ImageContents = ({ isLoading, autoPlay }) =>
  isLoading ? (
    <Skeleton height={ENTRY_IMAGE_HEIGHT} />
  ) : (
    <>
      <Lightbox />
      <Carousel autoPlay={autoPlay} />
    </>
  )

/**
 * The shared content tree for both the bottom-sheet and full-page shells.
 *
 * - Full page (sheetMode=false): image is a normal block at the top of a
 *   fill-height flex column; CardTabs fill the rest with internal scroll.
 * - Sheet (sheetMode=true): image is revealed/parallaxed by drag `progress`
 *   so the overview leads the peek, reproducing the deployed sheet geometry.
 */
const LocationContent = ({
  isLoading,
  hasImages,
  hasReviews,
  showTabList,
  tabIndex,
  onTabChange,
  reviewCount,
  sheetMode = false,
  progress = 0,
  isDrawerFullyOpen = false,
}) => {
  const { t } = useTranslation()
  const { saveDropdownOpen, reportModalOpen } = useLocationPane()

  // Autoplay runs in the fully-open pane, but not while the save dropdown or
  // report modal is open (they overlay the content and shouldn't have slides
  // shuffling behind them).
  const carouselAutoPlay = !saveDropdownOpen && !reportModalOpen

  return (
    <ContentColumn sheetMode={sheetMode}>
      {hasImages &&
        (sheetMode ? (
          <RevealedImage progress={progress}>
            {/* No autoplay in the peek: the sheet is a static summary. */}
            <ImageContents isLoading={isLoading} autoPlay={false} />
          </RevealedImage>
        ) : (
          <ImageBlock>
            <ImageContents isLoading={isLoading} autoPlay={carouselAutoPlay} />
          </ImageBlock>
        ))}
      {sheetMode && hasReviews && (
        <WhitespacePlaceholder progress={progress} hidden={isDrawerFullyOpen} />
      )}
      <CardTabs
        style={{ transition: 'none' }}
        onChange={onTabChange}
        index={tabIndex}
        $sheetMode={sheetMode}
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
            {sheetMode && <DummyScrollSpacer height={ENTRY_IMAGE_HEIGHT} />}
          </TabPanel>
          <TabPanel>
            <TextContent>
              <EntryReviews />
            </TextContent>
            {sheetMode && <DummyScrollSpacer height={ENTRY_IMAGE_HEIGHT} />}
          </TabPanel>
        </TabPanels>
      </CardTabs>
    </ContentColumn>
  )
}

export default LocationContent
