import { useWindowSize } from '@reach/window-size'
import { ArrowBack as ArrowBackIcon } from '@styled-icons/boxicons-regular'
import { Pencil as PencilIcon } from '@styled-icons/boxicons-solid'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import IconButton from '../ui/IconButton'
import Card from './Card'
import Carousel from './Carousel'
import Entry from './Entry'
// import EntryImagesCard from './EntryImagesCard'

const ENTRY_IMAGE_HEIGHT = 250

const INITIAL_IMAGE_HEIGHT_SCALAR = 0.6

const FOOTER_HEIGHT = 70

const BUTTON_HEIGHT = 80

const Container = styled.div`
  position: absolute;
  height: 100%;
  overflow: hidden;
  width: 100%;
  bottom: 70px;
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
    ${({ showEntryImages }) => !showEntryImages && `border-radius: 13px;`}
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
  position: absolute;
  top: 0;
  transform: translateY(
    ${({ heightScalar }) => -heightScalar * ENTRY_IMAGE_HEIGHT}px
  );
  transition: transform 0.15s linear;
  z-index: -10;
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
`

const EntryButton = styled(IconButton)`
  background-color: rgba(0, 0, 0, 0.45);
  border: none;
  svg {
    color: white;
  }
`

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

const EntryDrawer = ({
  locationData,
  reviews,
  showEntryImages,
  isLoading,
  entryOverview,
  entryReviews,
}) => {
  const history = useHistory()
  const cardRef = useRef()
  const [drawer, setDrawer] = useState()
  const [isFullScreen, setIsFullScreen] = useState(false)

  // TODO: Resizing the screen without refresh will break the drawer
  const { height: windowHeight } = useWindowSize()
  const paneHeight = windowHeight - FOOTER_HEIGHT
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

  const onBackButtonClick = () => {
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

  return (
    <>
      {isFullScreen && (
        <Buttons showEntryImages={showEntryImages}>
          <EntryButton
            onClick={onBackButtonClick}
            size={48}
            icon={<ArrowBackIcon />}
            label="back-button"
          />
          <EntryButton size={48} icon={<PencilIcon />} label="edit-button" />
        </Buttons>
      )}
      <Container
        className="entry-drawers"
        showEntryImages={showEntryImages}
        isFullScreen={isFullScreen}
      >
        <Card
          ref={cardRef}
          setDrawer={setDrawer}
          className="entry-main-card"
          config={config}
        >
          {showEntryImages ? (
            // TODO: Change to image carousel component
            <EntryImages heightScalar={entryImageHeightMultiplier}>
              {/* <EntryImagesCard
                src={reviews[0]?.photos[0]?.medium}
                alt="entry-image"
                isFullScreen={isFullScreen}
              /> */}
              <Carousel
                showIndicators={allReviewPhotos.length > 1}
                isFullScreen={isFullScreen}
              >
                {allReviewPhotos.map((photo) => (
                  <img key={photo.id} src={photo.medium} alt="entry" />
                ))}
              </Carousel>
            </EntryImages>
          ) : (
            <Backdrop isFullScreen={isFullScreen} />
          )}
          <Entry
            showEntryImages={showEntryImages}
            isFullScreen={isFullScreen}
            isInDrawer
            showTabs={isFullScreen}
            locationData={locationData}
            reviews={reviews}
            isLoading={isLoading}
            entryOverview={entryOverview}
            entryReviews={entryReviews}
          />
        </Card>
      </Container>
    </>
  )
}

export default EntryDrawer
