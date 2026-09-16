import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components/macro'

import {
  DRAG_HANDLE_HEIGHT_PX,
  ENTRY_IMAGE_HEIGHT_PX,
  TABS_HEIGHT_PX,
} from '../../constants/mobileLayout'
import { CardTabs, Tab, TabList, TabPanel, TabPanels } from './CardTabs'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import Lightbox from './lightbox/Lightbox'
import useLocationPane from './useLocationPane'

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

const ImageBlock = styled.div`
  width: 100%;
  flex-shrink: 0;
`

const RevealedImage = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  height: ${ENTRY_IMAGE_HEIGHT_PX}px;
  transform: translateY(
    ${({ progress }) => -progress * ENTRY_IMAGE_HEIGHT_PX}px
  );
  transition: transform 0.15s linear;
  z-index: -1;
`

const WhitespacePlaceholder = styled.div`
  width: 100%;
  background: white;
  height: ${({ progress }) =>
    progress * (TABS_HEIGHT_PX - DRAG_HANDLE_HEIGHT_PX)}px;
  transition: transform 0.15s linear;
  ${({ hidden }) => hidden && `display: none;`}
`

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
    <Skeleton height={ENTRY_IMAGE_HEIGHT_PX} />
  ) : (
    <>
      <Lightbox />
      <Carousel autoPlay={autoPlay} />
    </>
  )

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

  const carouselAutoPlay = !saveDropdownOpen && !reportModalOpen

  return (
    <ContentColumn sheetMode={sheetMode}>
      {hasImages &&
        (sheetMode ? (
          <RevealedImage progress={progress}>
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
            {sheetMode && <DummyScrollSpacer height={ENTRY_IMAGE_HEIGHT_PX} />}
          </TabPanel>
          <TabPanel>
            <TextContent>
              <EntryReviews />
            </TextContent>
            {sheetMode && <DummyScrollSpacer height={ENTRY_IMAGE_HEIGHT_PX} />}
          </TabPanel>
        </TabPanels>
      </CardTabs>
    </ContentColumn>
  )
}

export default LocationContent
