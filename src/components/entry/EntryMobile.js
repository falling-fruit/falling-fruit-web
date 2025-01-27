import { ArrowBack as ArrowBackIcon } from '@styled-icons/boxicons-regular'
import {
  Map as MapIcon,
  Pencil as PencilIcon,
} from '@styled-icons/boxicons-solid'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import {
  fullyOpenPaneDrawer,
  partiallyClosePaneDrawer,
  reenableAndPartiallyClosePaneDrawer,
  setTabIndex,
} from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import DraggablePane from '../ui/DraggablePane'
import { EntryTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/EntryTabs'
import { zIndex } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'
import LightboxMobile from './LightboxMobile'

const ENTRY_IMAGE_HEIGHT = 250

const TOP_BAR_HEIGHT = 80
const ENTRY_TABS_HEIGHT = 50

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

const TopRibbonButtons = ({ hasImages, drawerDisabled, onBackButtonClick }) => {
  const history = useAppHistory()
  const dispatch = useDispatch()
  const { locationId } = useSelector((state) => state.location)

  return (
    <StyledButtons whiteBackground={!hasImages}>
      <EntryButton
        onClick={
          drawerDisabled ? () => history.push('/list') : onBackButtonClick
        }
        icon={<ArrowBackIcon />}
        label="back-button"
      />
      <div>
        {drawerDisabled && (
          <EntryButton
            onClick={(event) => {
              event.stopPropagation()
              dispatch(reenableAndPartiallyClosePaneDrawer())
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
  )
}

const StyledButtons = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
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
      margin-right: 0.5em;
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
    margin: 0 0 12px 0;
  }
`

const EntryMobile = () => {
  const dispatch = useDispatch()
  const history = useAppHistory()
  const {
    reviews,
    isLoading,
    pane: { drawerFullyOpen, tabIndex, drawerDisabled },
  } = useSelector((state) => state.location)
  const { isOpenInMobileLayout: filterOpen } = useSelector(
    (state) => state.filter,
  )
  const hasImages =
    reviews &&
    reviews.filter((review) => review.photos && review.photos.length > 0)
      .length > 0

  const [progress, setProgress] = useState(
    drawerFullyOpen || drawerDisabled ? 1 : 0.3,
  )
  const onBackButtonClick = (e) => {
    e.stopPropagation()
    dispatch(partiallyClosePaneDrawer())
  }

  if (isLoading) {
    return null
  }

  const hasReviews = reviews && reviews.length > 0

  return (
    <>
      <DraggablePane
        displayOverTopBar={!filterOpen || drawerFullyOpen}
        topPositionHeight={hasImages ? ENTRY_IMAGE_HEIGHT : TOP_BAR_HEIGHT}
        middlePositionScreenRatio={0.7}
        position={drawerFullyOpen || drawerDisabled ? 'top' : 'middle'}
        onPositionChange={(position) => {
          if (position === 'top') {
            setProgress(1)
            setTimeout(() => dispatch(fullyOpenPaneDrawer()), 0.25)
          } else if (position === 'middle') {
            setProgress(0.3)
            dispatch(partiallyClosePaneDrawer())
          } else if (position === 'bottom') {
            history.push('/map')
          }
        }}
        drawerDisabled={drawerDisabled || drawerFullyOpen}
        updateProgress={setProgress}
        hasImages={hasImages}
        showMoveElement={!(drawerFullyOpen || drawerDisabled)}
      >
        {hasImages && (
          <RevealedFromUnderneath
            targetHeight={ENTRY_IMAGE_HEIGHT}
            progress={progress}
            isDrawerFullyOpen={drawerFullyOpen}
          >
            <LightboxMobile />
            <Carousel />
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
              <Tab>Overview</Tab>
              <Tab>Reviews ({reviews.length})</Tab>
            </TabList>
          )}
          <TabPanels style={{ background: 'white' }}>
            <TabPanel>
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
      {(drawerFullyOpen || drawerDisabled) && (
        <TopRibbonButtons
          hasImages={hasImages}
          drawerDisabled={drawerDisabled}
          onBackButtonClick={onBackButtonClick}
        />
      )}
    </>
  )
}

export default EntryMobile
