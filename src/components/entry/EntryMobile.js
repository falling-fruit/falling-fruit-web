import {
  Map as MapIcon,
  Pencil as PencilIcon,
} from '@styled-icons/boxicons-solid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import {
  fullyOpenPaneDrawer,
  reenablePaneDrawerAndSetToLowPosition,
  setPaneDrawerToLowPosition,
  setPaneDrawerToMiddlePosition,
  setTabIndex,
} from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import DraggablePane from '../ui/DraggablePane'
import { EntryTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/EntryTabs'
import { zIndex } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import ReturnIcon from '../ui/ReturnIcon'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import LightboxMobile from './LightboxMobile'

const ENTRY_IMAGE_HEIGHT = 250

const TOP_BAR_HEIGHT = 80
const ENTRY_TABS_HEIGHT = 50

const calculateProgress = (currentPosition, topBoundary, bottomBoundary) =>
  Math.max(
    0,
    Math.min(
      1,
      1 - (topBoundary - currentPosition) / (topBoundary - bottomBoundary),
    ),
  )

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

const RevealedFromUnderneath = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  ${({ isDrawerFullyOpen }) =>
    isDrawerFullyOpen &&
    `pointer-events: none;

  > * {
    pointer-events: auto;
  }

    `}
  ${({ targetHeight, progress }) =>
    `
    height: ${targetHeight}px;
    transform: translateY(
      ${-progress * targetHeight}px
    );
    transition: transform 0.15s linear;
    z-index: -1;
  `}
`
const WhitespacePlaceholder = styled.div`
  width: 100%;
  background: white;
  ${({ targetHeight, progress }) =>
    `
  height: ${progress * targetHeight}px;

    `}
  transition: transform 0.15s linear;
  ${({ hidden }) => hidden && `display: none;`}
`

/*
 * ScrollablePane layout has a translateY property, which can hide some of the content in e.g. the reviews tab
 * as a workaround, add an element with that same height
 */
const DummyElementFixingScrollbarInsideTabPanel = styled.div`
  height: ${(props) => props.height}px;
`

const StyledButtons = styled.div`
  position: absolute;
  inset-inline: 0;
  inset-block-start: 0;
  z-index: ${zIndex.topBar + 1};
  padding: 16px;
  display: flex;
  justify-content: space-between;
  ${({ whiteBackground }) => whiteBackground && `background: white;`}
  pointer-events: none;

  button {
    pointer-events: auto;
  }

  > div {
    display: flex;

    > *:not(:last-of-type) {
      margin-inline-end: 0.5em;
    }
  }
`

const EntryButton = styled(IconButton)`
  background-color: rgba(0, 0, 0, 0.45);
  border: none;
  svg {
    color: white;
  }
`

EntryButton.defaultProps = {
  size: 48,
}

const TextContent = styled.article`
  padding: 20px 23px;

  box-sizing: border-box;

  ul {
    margin-block: 0 12px;
    margin-inline: 0;
  }
`

const EntryMobile = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useAppHistory()
  const {
    locationId,
    reviews,
    isLoading,
    pane: {
      drawerFullyOpen,
      drawerLow,
      tabIndex,
      isFromListLocations,
      isFromEmbedViewMap,
    },
  } = useSelector((state) => state.location)

  const drawerDisabled = isFromEmbedViewMap || isFromListLocations
  const { isOpenInMobileLayout: filterOpen } = useSelector(
    (state) => state.filter,
  )
  const hasImages =
    reviews &&
    reviews.filter((review) => review.photos && review.photos.length > 0)
      .length > 0

  const [currentTranslateY, setCurrentTranslateY] = useState(
    drawerFullyOpen || drawerDisabled
      ? hasImages
        ? ENTRY_IMAGE_HEIGHT
        : TOP_BAR_HEIGHT
      : window.innerHeight * 0.7,
  )

  const offset = hasImages ? ENTRY_IMAGE_HEIGHT : TOP_BAR_HEIGHT
  const progress = calculateProgress(
    currentTranslateY,
    offset,
    window.innerHeight,
  )

  const hasReviews = reviews && reviews.length > 0

  return (
    <>
      <DraggablePane
        displayOverTopBar={!filterOpen || drawerFullyOpen}
        topPositionHeight={hasImages ? ENTRY_IMAGE_HEIGHT : TOP_BAR_HEIGHT}
        middlePositionScreenRatio={0.7}
        partialPositionHeightPx={80}
        position={
          drawerFullyOpen || drawerDisabled
            ? 'top'
            : drawerLow
              ? 'low'
              : 'middle'
        }
        onPositionChange={(position) => {
          if (position === 'top') {
            setTimeout(() => dispatch(fullyOpenPaneDrawer()), 0.25)
          } else if (position === 'middle') {
            dispatch(setPaneDrawerToMiddlePosition())
          } else if (position === 'low') {
            dispatch(setPaneDrawerToLowPosition())
          } else if (position === 'bottom') {
            history.push('/map')
          } else {
            console.error(position)
          }
        }}
        drawerDisabled={drawerDisabled || drawerFullyOpen}
        onChangeTranslateY={setCurrentTranslateY}
        hasWhiteBackground={!isLoading && hasImages}
        showMoveElement={!(drawerFullyOpen || drawerDisabled)}
      >
        {hasImages && (
          <RevealedFromUnderneath
            targetHeight={ENTRY_IMAGE_HEIGHT}
            progress={progress}
            isDrawerFullyOpen={drawerFullyOpen}
          >
            {isLoading ? (
              <Skeleton height={ENTRY_IMAGE_HEIGHT} />
            ) : (
              <>
                <LightboxMobile />
                <Carousel />
              </>
            )}
          </RevealedFromUnderneath>
        )}
        {hasReviews && (
          <WhitespacePlaceholder
            progress={progress}
            hidden={drawerFullyOpen}
            targetHeight={ENTRY_TABS_HEIGHT}
          />
        )}
        <EntryTabs
          style={{ transition: 'none' }}
          onChange={(index) => dispatch(setTabIndex(index))}
          index={tabIndex}
        >
          {drawerFullyOpen && hasReviews && (
            <TabList>
              <Tab>{t('locations.overview.title')}</Tab>
              <Tab>{`${t('glossary.review.other')} (${reviews.length})`}</Tab>
            </TabList>
          )}
          <TabPanels style={{ background: 'white' }}>
            <TabPanel>
              {isLoading && <EntryLoading />}
              <TextContent>
                <EntryOverview />
              </TextContent>
              <DummyElementFixingScrollbarInsideTabPanel
                height={hasImages ? ENTRY_IMAGE_HEIGHT : TOP_BAR_HEIGHT}
              />
            </TabPanel>
            <TabPanel>
              <TextContent>
                <EntryReviews />
              </TextContent>
              <DummyElementFixingScrollbarInsideTabPanel
                height={hasImages ? ENTRY_IMAGE_HEIGHT : TOP_BAR_HEIGHT}
              />
            </TabPanel>
          </TabPanels>
        </EntryTabs>
      </DraggablePane>
      {drawerFullyOpen && (
        <StyledButtons whiteBackground={!hasImages}>
          <EntryButton
            onClick={
              isFromEmbedViewMap
                ? () => history.push('/map')
                : isFromListLocations
                  ? () => history.push('/list')
                  : (e) => {
                      e.stopPropagation()
                      dispatch(setPaneDrawerToMiddlePosition())
                    }
            }
            icon={<ReturnIcon />}
            label="back-button"
          />
          <div>
            {isFromListLocations && (
              <EntryButton
                onClick={(event) => {
                  event.stopPropagation()
                  dispatch(reenablePaneDrawerAndSetToLowPosition())
                }}
                icon={<MapIcon />}
                label="map-button"
              />
            )}
            <EntryButton
              onClick={(event) => {
                event.stopPropagation()
                history.push(`/locations/${locationId}/edit`)
              }}
              icon={<PencilIcon />}
              label="edit-button"
            />
          </div>
        </StyledButtons>
      )}
    </>
  )
}

export default EntryMobile
