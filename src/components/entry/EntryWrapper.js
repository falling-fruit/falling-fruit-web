import { useWindowSize } from '@reach/window-size'
import { ArrowBack as ArrowBackIcon } from '@styled-icons/boxicons-regular'
import { Pencil as PencilIcon } from '@styled-icons/boxicons-solid'
import { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getLocationById, getReviews } from '../../utils/api'
import IconButton from '../ui/IconButton'
import Card from './Card'
import Entry from './Entry'
import EntryImagesCard from './EntryImagesCard'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'

const ENTRY_IMAGE_HEIGHT = 250

const INITIAL_IMAGE_HEIGHT_SCALAR = 0.6

const FOOTER_HEIGHT = 70

const Container = styled.div`
  position: absolute;
  height: 100%;
  overflow: hidden;
  width: 100%;
  bottom: 70px;
  left: 0;

  .pane {
    background: none;
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

const EntryWrapper = ({ isInDrawer }) => {
  const { height: windowHeight } = useWindowSize()
  const paneHeight = windowHeight - FOOTER_HEIGHT
  const initialCardHeight = paneHeight * 0.3
  const [finalCardHeight, setFinalCardHeight] = useState(
    paneHeight - ENTRY_IMAGE_HEIGHT,
  )
  const maxDelta = finalCardHeight - initialCardHeight

  const history = useHistory()
  const [locationData, setLocationData] = useState()
  const [reviews, setReviews] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [entryImageHeightMultiplier, setEntryImageHeightMultiplier] = useState(
    INITIAL_IMAGE_HEIGHT_SCALAR,
  )
  const [drawer, setDrawer] = useState()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showEntryImages, setShowEntryImages] = useState(false)
  const cardRef = useRef()
  const { id } = useParams()

  useEffect(() => {
    async function fetchEntryData() {
      setIsLoading(true)

      const [locationData, reviews] = await Promise.all([
        getLocationById(id),
        getReviews(id),
      ])

      setLocationData(locationData)
      setReviews(reviews)

      const showEntryImages = reviews && reviews[0]?.photos.length > 0
      setShowEntryImages(showEntryImages)
      if (!showEntryImages) {
        setFinalCardHeight(paneHeight)
      }

      setIsLoading(false)
    }

    fetchEntryData()
  }, [id, paneHeight, drawer])

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

  const addSubmittedReview = (submittedReview) => {
    setReviews((reviews) => [...reviews, submittedReview])
  }

  const entryOverview = (
    <EntryOverview
      showTagsInOverview={!isInDrawer || !showEntryImages}
      locationData={locationData}
    />
  )
  const entryReviews = (
    <EntryReviews reviews={reviews} onReviewSubmit={addSubmittedReview} />
  )

  const onDrag = () => {
    const transformStyles = cardRef.current.parentNode.style.transform
    const [, transformYMatch] = /translateY\((.*?)px\)/g.exec(transformStyles)
    const delta = windowHeight - transformYMatch - initialCardHeight
    let newHeightMultiplier =
      INITIAL_IMAGE_HEIGHT_SCALAR +
      (1 - INITIAL_IMAGE_HEIGHT_SCALAR) * (delta / maxDelta)
    if (delta < 0) {
      newHeightMultiplier = INITIAL_IMAGE_HEIGHT_SCALAR + delta / maxDelta
    }
    setEntryImageHeightMultiplier(newHeightMultiplier)
  }

  const onTransitionEnd = () => {
    if (cardRef.current) {
      const transformStyles = cardRef.current.parentNode.style.transform
      const [, transformYMatch] = /translateY\((.*?)px\)/g.exec(transformStyles)
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
    touchMoveStopPropagation: true,
  }

  return isInDrawer ? (
    <>
      {isFullScreen && (
        <Buttons>
          <EntryButton size={48} icon={<ArrowBackIcon />} label="back-button" />
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
          {showEntryImages && (
            <EntryImages heightScalar={entryImageHeightMultiplier}>
              <EntryImagesCard image={reviews[0]?.photos[0]?.medium} />
            </EntryImages>
          )}
          <Entry
            isInDrawer
            locationData={locationData}
            reviews={reviews}
            isLoading={isLoading}
            entryOverview={entryOverview}
            entryReviews={entryReviews}
          />
        </Card>
      </Container>
    </>
  ) : (
    <Entry
      locationData={locationData}
      reviews={reviews}
      isLoading={isLoading}
      entryOverview={entryOverview}
      entryReviews={entryReviews}
    />
  )
}

export default EntryWrapper
