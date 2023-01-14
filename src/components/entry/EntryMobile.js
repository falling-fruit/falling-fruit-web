import { useWindowSize } from '@reach/window-size'
import { ArrowBack as ArrowBackIcon } from '@styled-icons/boxicons-regular'
import {
  Map as MapIcon,
  Pencil as PencilIcon,
} from '@styled-icons/boxicons-solid'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import IconButton from '../ui/IconButton'
import Card from './Card'
import Carousel from './Carousel'
import Entry from './Entry'

const ENTRY_IMAGE_HEIGHT = 250

const INITIAL_IMAGE_HEIGHT_SCALAR = 0.6

const FOOTER_HEIGHT = 50

const BUTTON_HEIGHT = 80

const PageContainer = styled.div`
  margin-top: ${BUTTON_HEIGHT}px;

  .pane {
    background: none;
    padding-top: 0;
    ${({ showEntryImages }) => !showEntryImages && `box-shadow: none;`}
  }

  > div {
    background: white;
    height: 100% !important;
  }
`

const DrawerContainer = styled.div`
  position: absolute;
  height: 100%;
  overflow: hidden;
  width: 100%;
  left: 0;

  .pane {
    background: none;
    ${({ isFullScreen }) => isFullScreen && `padding-top: 0;`}
    ${({ showEntryImages, isFullScreen }) =>
      !showEntryImages && isFullScreen && `box-shadow: none;`}
  }

  .draggable {
    background: white;
    z-index: -1;
    padding-top: 10px;
    ${({ showEntryImages }) => !showEntryImages && `border-radius: 0.375em;`}
  }

  .move {
    ${({ isFullScreen }) => isFullScreen && `visibility: hidden;`}
  }

  .entry-main-card {
    background: white;
    height: 100% !important;
  }
`

const EntryImages = styled.div`
  width: 100%;
  height: ${ENTRY_IMAGE_HEIGHT}px;

  ${({ $isInDrawer, heightScalar }) =>
    $isInDrawer
      ? `position: absolute;
    top: 0;
    transform: translateY(
      ${-heightScalar * ENTRY_IMAGE_HEIGHT}px
    );
    transition: transform 0.15s linear;
    z-index: -10;
  `
      : `margin-top: -${BUTTON_HEIGHT}px;`}
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

const Backdrop = styled.div`
  width: 100%;
  height: ${BUTTON_HEIGHT}px;
  position: absolute;
  top: 0;
  background: white;
  z-index: -10;
  transform: ${({ isFullScreen }) =>
    isFullScreen ? `translateY(${-BUTTON_HEIGHT}px);` : `translateY(10px);`};
  transition: transform 0.15s linear;
`

const EntryMobile = ({
  locationData,
  reviews,
  isLoading,
  entryOverview,
  entryReviews,
}) => {
  const history = useAppHistory()
  const { state } = useLocation()
  const cardRef = useRef()
  const [drawer, setDrawer] = useState()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const showEntryImages = reviews && reviews[0]?.photos.length > 0

  const isInDrawer = state?.fromPage !== '/list'

  // TODO: Resizing the screen without refresh will break the drawer
  const { height: windowHeight } = useWindowSize()
  const paneHeight = windowHeight
  const initialCardHeight = paneHeight * 0.3
  const [finalCardHeight, setFinalCardHeight] = useState(
    paneHeight - ENTRY_IMAGE_HEIGHT,
  )
  // maxDelta is the maximum amount of pixels the card can be dragged
  const maxDelta = finalCardHeight - initialCardHeight
  const [entryImageHeightMultiplier, setEntryImageHeightMultiplier] = useState(
    INITIAL_IMAGE_HEIGHT_SCALAR,
  )

  useEffect(() => {
    if (!showEntryImages) {
      setFinalCardHeight(paneHeight - BUTTON_HEIGHT)
    } else {
      setFinalCardHeight(paneHeight - ENTRY_IMAGE_HEIGHT)
    }
  }, [showEntryImages, paneHeight])

  useEffect(() => {
    if (drawer) {
      drawer.setBreakpoints({
        top: {
          enabled: true,
          height: finalCardHeight,
        },
      })
    }
  }, [drawer, finalCardHeight])

  useEffect(() => {
    if (drawer) {
      if (isFullScreen) {
        drawer.disableDrag()
      } else {
        drawer.enableDrag()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullScreen])

  const onDrag = () => {
    // The height of cupertino pane is adjusted using transformY as it is dragged.
    // Parse the transformY value to calculate the current height progress of the card.
    const transformStyles = cardRef.current.parentNode.style.transform
    const [, transformYMatch] = /translateY\((.*?)px\)/g.exec(transformStyles)
    const delta = windowHeight - transformYMatch - initialCardHeight
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
      // Parse the card's transformY value to identify the closest breakpoint.
      if (parseFloat(transformYMatch) === windowHeight - initialCardHeight) {
        setEntryImageHeightMultiplier(INITIAL_IMAGE_HEIGHT_SCALAR)
        setIsFullScreen(false)
      } else if (
        parseFloat(transformYMatch) === showEntryImages
          ? ENTRY_IMAGE_HEIGHT + FOOTER_HEIGHT
          : FOOTER_HEIGHT
      ) {
        setEntryImageHeightMultiplier(1)
        setIsFullScreen(true)
      }
    }
  }

  const onBackButtonClick = (e) => {
    e.stopPropagation()
    setIsFullScreen(false)
    drawer.moveToBreak('middle')
    setEntryImageHeightMultiplier(INITIAL_IMAGE_HEIGHT_SCALAR)
  }

  const config = {
    initialBreak: 'middle',
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

  const allReviewPhotos = (reviews ?? [])
    .map((reviews) => reviews.photos)
    .flat()

  const inner = (
    <div>
      {showEntryImages ? (
        <EntryImages
          $isInDrawer={isInDrawer}
          heightScalar={!isInDrawer ? 1 : entryImageHeightMultiplier}
        >
          <Carousel
            showIndicators={allReviewPhotos.length > 1}
            isFullScreen={!isInDrawer || isFullScreen}
          >
            {allReviewPhotos.map((photo) => (
              <img key={photo.id} src={photo.medium} alt="entry" />
            ))}
          </Carousel>
        </EntryImages>
      ) : (
        <Backdrop isFullScreen={!isInDrawer || isFullScreen} />
      )}
      <Entry
        showEntryImages={showEntryImages}
        isFullScreen={!isInDrawer || isFullScreen}
        isInDrawer
        showTabs={!isInDrawer || isFullScreen}
        locationData={locationData}
        reviews={reviews}
        isLoading={isLoading}
        entryOverview={entryOverview}
        entryReviews={entryReviews}
      />
    </div>
  )

  return (
    <>
      {(!isInDrawer || isFullScreen) && (
        <Buttons showEntryImages={showEntryImages}>
          <EntryButton
            onClick={
              !isInDrawer
                ? () => history.push(state?.fromPage ?? '/map')
                : onBackButtonClick
            }
            icon={<ArrowBackIcon />}
            label="back-button"
          />
          <div>
            {!isInDrawer && (
              <EntryButton
                onClick={(event) => {
                  event.stopPropagation()
                  history.push(`/locations/${locationData.id}`, {
                    fromPage: '/map',
                  })
                }}
                icon={<MapIcon />}
                label="map-button"
              />
            )}
            <EntryButton
              onClick={() => history.push(`/locations/${locationData.id}/edit`)}
              icon={<PencilIcon />}
              label="edit-button"
            />
          </div>
        </Buttons>
      )}

      {isInDrawer ? (
        <DrawerContainer
          className="entry-drawers"
          showEntryImages={showEntryImages}
          isFullScreen={isFullScreen}
        >
          <Card
            ref={cardRef}
            setDrawer={setDrawer}
            drawer={drawer}
            isFullScreen={isFullScreen}
            className="entry-main-card"
            config={config}
          >
            {inner}
          </Card>
        </DrawerContainer>
      ) : (
        <PageContainer showEntryImages={showEntryImages}>{inner}</PageContainer>
      )}
    </>
  )
}

export default EntryMobile
