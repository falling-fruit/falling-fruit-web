import { useWindowSize } from '@reach/window-size'
import { ArrowBack as ArrowBackIcon } from '@styled-icons/boxicons-regular'
import {
  Map as MapIcon,
  Pencil as PencilIcon,
} from '@styled-icons/boxicons-solid'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import {
  fullyOpenPaneDrawer,
  partiallyClosePaneDrawer,
  reenableAndPartiallyClosePaneDrawer,
  setTabIndex,
} from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { EntryTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/EntryTabs'
import IconButton from '../ui/IconButton'
import Card from './Card'
import Carousel from './Carousel'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'

const ENTRY_IMAGE_HEIGHT = 250

const INITIAL_IMAGE_HEIGHT_SCALAR = 0.6

const TOP_BAR_HEIGHT = 80
const ENTRY_TABS_HEIGHT = 50

const DrawerContainer = styled.div`
  position: absolute;
  height: 100%;
  overflow: hidden;
  width: 100%;
  left: 0;

  .pane {
    background: none;
    // Expand Cupertino Pane from default (500px) to full width
    max-width: 100%;
  }

  .draggable {
    background: white;
    z-index: -1;
    ${({ hasImages }) => !hasImages && `padding-top: 10px`}
  }
  .move {
    ${({ showMoveElement }) => !showMoveElement && `visibility: hidden; `}
  }

  .entry-main-card {
    background: white;
    height: 100% !important;
  }
`

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
  ${({ hidden }) => hidden && `display: none;`}
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
  const cardRef = useRef()
  const {
    locationId,
    reviews,
    isLoading,
    pane: { drawerFullyOpen, tabIndex, drawerDisabled },
  } = useSelector((state) => state.location)
  const [drawer, setDrawer] = useState()
  const hasImages =
    reviews &&
    reviews.filter((review) => review.photos && review.photos.length > 0)
      .length > 0

  const bufferHeight = hasImages ? ENTRY_IMAGE_HEIGHT : TOP_BAR_HEIGHT

  // TODO: Resizing the screen without refresh will break the drawer
  const { height: windowHeight } = useWindowSize()
  const paneHeight = windowHeight
  const initialCardHeight = paneHeight * 0.3
  const finalCardHeight = paneHeight - bufferHeight
  // maxDelta is the maximum amount of pixels the card can be dragged
  const maxDelta = finalCardHeight - initialCardHeight
  const [entryImageHeightMultiplier, setEntryImageHeightMultiplier] = useState(
    INITIAL_IMAGE_HEIGHT_SCALAR,
  )

  const onDrag = () => {
    // The height of cupertino pane is adjusted using transformY as it is dragged.
    // Parse the transformY value to calculate the current height progress of the card.
    const transformStyles = cardRef.current.parentNode.style.transform
    const [, transformYMatch] = /translateY\((.*?)px\)/g.exec(transformStyles)
    const transformY = parseFloat(transformYMatch)
    const delta = windowHeight - transformY - initialCardHeight
    let newHeightMultiplier =
      INITIAL_IMAGE_HEIGHT_SCALAR +
      (1 - INITIAL_IMAGE_HEIGHT_SCALAR) * (delta / maxDelta)
    if (delta < 0) {
      // If delta is negative, the card is being dragged downward.
      newHeightMultiplier = INITIAL_IMAGE_HEIGHT_SCALAR + delta / maxDelta
    }
    setEntryImageHeightMultiplier(newHeightMultiplier)
  }

  const onTransitionEnd = () => {
    if (cardRef.current) {
      const transformStyles = cardRef.current.parentNode.style.transform
      const [, transformYMatch] = /translateY\((.*?)px\)/g.exec(transformStyles)
      const transformY = parseFloat(transformYMatch)
      // Parse the card's transformY value to identify the closest breakpoint.
      if (transformY === windowHeight - initialCardHeight) {
        setEntryImageHeightMultiplier(INITIAL_IMAGE_HEIGHT_SCALAR)
        dispatch(partiallyClosePaneDrawer())
      } else if (transformY <= ENTRY_IMAGE_HEIGHT) {
        setEntryImageHeightMultiplier(1)
        dispatch(fullyOpenPaneDrawer())
      }
    }
  }

  const onBackButtonClick = (e) => {
    e.stopPropagation()
    drawer.moveToBreak('middle')
  }

  const config = {
    initialBreak: drawerFullyOpen ? 'top' : 'middle',
    breaks: {
      top: { enabled: true, height: finalCardHeight },
      middle: { enabled: true, height: initialCardHeight },
      bottom: { enabled: false },
    },
    onDrag,
    onTransitionEnd,
    buttonClose: false,
    bottomClose: true,
    onDidDismiss: () => history.push('/map'),
    cssClass: `entry-main-card`,
    parentElement: '.entry-drawers',
  }

  if (isLoading) {
    return null
  }

  return (
    <DrawerContainer
      className="entry-drawers"
      hasImages={hasImages}
      showMoveElement={!drawerFullyOpen}
    >
      <Card
        ref={cardRef}
        setDrawer={setDrawer}
        drawer={drawer}
        drawerFullyOpen={drawerFullyOpen}
        className="entry-main-card"
        config={config}
      >
        {hasImages && (
          <RevealedFromUnderneath
            targetHeight={ENTRY_IMAGE_HEIGHT}
            progress={entryImageHeightMultiplier}
          >
            <Carousel />
          </RevealedFromUnderneath>
        )}
        <WhitespacePlaceholder
          progress={entryImageHeightMultiplier}
          hidden={drawerFullyOpen}
          targetHeight={ENTRY_TABS_HEIGHT}
        />
        <EntryTabs
          onChange={(index) => dispatch(setTabIndex(index))}
          index={tabIndex}
        >
          {drawerFullyOpen && (
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Reviews ({reviews.length})</Tab>
            </TabList>
          )}
          <TabPanels>
            <TabPanel>
              <EntryOverview />
            </TabPanel>
            <TabPanel>
              <EntryReviews />
            </TabPanel>
          </TabPanels>
        </EntryTabs>
      </Card>
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
              onClick={() =>
                history.push(`/locations/${locationId}/edit/details`)
              }
              icon={<PencilIcon />}
              label="edit-button"
            />
          </div>
        </Buttons>
      )}
    </DrawerContainer>
  )
}

export default EntryMobile
