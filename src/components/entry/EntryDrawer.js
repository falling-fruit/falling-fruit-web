import { useWindowSize } from '@reach/window-size'
import { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getLocationById, getReviews } from '../../utils/api'
import Card from './Card'
import Entry from './Entry'
import EntryImagesCard from './EntryImagesCard'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'

const ENTRY_IMAGE_HEIGHT = 250

const INITIAL_IMAGE_HEIGHT_SCALAR = 0.6

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
  }

  .entry-main-card {
    background: white;
  }
`

const EntryImages = styled.div`
  width: 100%;
  height: ${ENTRY_IMAGE_HEIGHT}px;
  position: absolute;
  top: ${({ heightScalar }) => -heightScalar * ENTRY_IMAGE_HEIGHT}px;
  z-index: -10;
`

const EntryDrawer = () => {
  const { height: windowHeight } = useWindowSize()
  const paneHeight = windowHeight - 70
  const initialCardHeight = paneHeight * 0.3
  const finalCardHeight = paneHeight - ENTRY_IMAGE_HEIGHT
  const maxDelta = finalCardHeight - initialCardHeight

  const history = useHistory()
  const [locationData, setLocationData] = useState()
  const [reviews, setReviews] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [entryImageHeightMultiplier, setEntryImageHeightMultiplier] = useState(
    INITIAL_IMAGE_HEIGHT_SCALAR,
  )
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

      setIsLoading(false)
    }

    fetchEntryData()
  }, [id])

  // useEffect(() => {
  //   console.log('HERE')
  //   if (cardRef?.current?.parentNode?.style?.transform) {
  //     const transformStyles = cardRef.current.parentNode.style.transform
  //     const [, transformYMatch] = /translateY\((.*?)px\)/g.exec(transformStyles)
  //     console.log('HERE', transformYMatch)
  //   }
  // }, [cardRef?.current?.parentNode?.style?.transform])

  const addSubmittedReview = (submittedReview) => {
    setReviews((reviews) => [...reviews, submittedReview])
  }

  const entryOverview = <EntryOverview locationData={locationData} />
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

  const config = {
    initialBreak: 'middle',
    breaks: {
      top: { enabled: true, height: finalCardHeight, bounce: true },
      middle: { enabled: true, height: initialCardHeight },
      bottom: { enabled: false },
    },
    onDrag,
    buttonClose: false,
    bottomClose: true,
    onDidDismiss: () => history.push('/map'),
    cssClass: `entry-main-card`,
    parentElement: '.entry-drawers',
  }

  return (
    <Container className="entry-drawers">
      <Card ref={cardRef} className="entry-main-card" config={config}>
        {reviews && reviews.length > 0 && (
          <EntryImages heightScalar={entryImageHeightMultiplier}>
            <EntryImagesCard image={reviews?.[0]?.photos?.[0].medium} />
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
  )
}

export default EntryDrawer
