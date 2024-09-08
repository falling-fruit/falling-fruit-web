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
import IconButton from '../ui/IconButton'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'

const ENTRY_IMAGE_HEIGHT = 250

const TOP_BAR_HEIGHT = 80
const ENTRY_TABS_HEIGHT = 50

const RevealedFromUnderneath = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  ${({ targetHeight, progress }) =>
    `
    height: ${targetHeight}px;
    transform: translateY(
      ${-progress * targetHeight}px
    );
    transition: transform 0.15s linear;
    z-index: -10;
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

const Buttons = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 12;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  ${({ whiteBackground }) => whiteBackground && `background: white;`}

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

const EntryMobile = () => {
  const dispatch = useDispatch()
  const history = useAppHistory()
  const {
    locationId,
    reviews,
    isLoading,
    pane: { drawerFullyOpen, tabIndex, drawerDisabled },
  } = useSelector((state) => state.location)
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

  return (
    <>
      <DraggablePane
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
        showMoveElement={!drawerFullyOpen}
      >
        {hasImages && (
          <RevealedFromUnderneath
            targetHeight={ENTRY_IMAGE_HEIGHT}
            progress={progress}
          >
            <Carousel />
          </RevealedFromUnderneath>
        )}
        <WhitespacePlaceholder
          progress={progress}
          hidden={drawerFullyOpen}
          targetHeight={ENTRY_TABS_HEIGHT}
        />
        <EntryTabs
          style={{ transition: 'none' }}
          onChange={(index) => dispatch(setTabIndex(index))}
          index={tabIndex}
        >
          {drawerFullyOpen && (
            <TabList>
              <Tab>Overview</Tab>
              <Tab greyedOut={reviews.length === 0}>
                <span style={{ opacity: reviews.length ? 1 : 0.5 }}>
                  Reviews ({reviews.length})
                </span>
              </Tab>
            </TabList>
          )}
          <TabPanels>
            <TabPanel>
              <EntryOverview />
              <DummyElementFixingScrollbarInsideTabPanel
                height={hasImages ? ENTRY_IMAGE_HEIGHT : TOP_BAR_HEIGHT}
              />
            </TabPanel>
            <TabPanel>
              <EntryReviews />
              <DummyElementFixingScrollbarInsideTabPanel
                height={hasImages ? ENTRY_IMAGE_HEIGHT : TOP_BAR_HEIGHT}
              />
            </TabPanel>
          </TabPanels>
        </EntryTabs>
      </DraggablePane>
      {drawerFullyOpen && (
        <Buttons whiteBackground={!hasImages}>
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
                history.push(`/locations/${locationId}/edit/details`)
              }}
              icon={<PencilIcon />}
              label="edit-button"
            />
          </div>
        </Buttons>
      )}
    </>
  )
}

export default EntryMobile
