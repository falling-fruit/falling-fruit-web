import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getLocationById, getReviews } from '../../utils/api'
import Card from './Card'
import Entry from './Entry'
import EntryImagesCard from './EntryImagesCard'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'

const Container = styled.div`
  position: absolute;
  height: 100%;
  overflow: hidden;
  width: 100%;
  bottom: 80px;
  left: 0;
`

const EntryImages = styled.div`
  z-index: 1;
`

const EntryMainCard = styled.div`
  z-index: 2;
`

const EntryDrawer = () => {
  const history = useHistory()
  const [locationData, setLocationData] = useState()
  const [reviews, setReviews] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [cardOneRef, setCardOneRef] = useState(null)
  const [cardTwoRef, setCardTwoRef] = useState(null)
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

  const addSubmittedReview = (submittedReview) => {
    setReviews((reviews) => [...reviews, submittedReview])
  }

  const entryOverview = <EntryOverview locationData={locationData} />
  const entryReviews = (
    <EntryReviews reviews={reviews} onReviewSubmit={addSubmittedReview} />
  )

  const config = {
    initialBreak: 'top',
    breaks: {
      top: { enabled: true, height: 350, bounce: true },
      middle: { enabled: false },
      bottom: { enabled: false },
    },
    showDraggable: false,
    buttonClose: false,
    bottomClose: true,
    onDidDismiss: () => history.push('/map'),
  }

  const onDrag = (num, t) => {
    if (t.delta > 70) {
      // TODO: Increase height of card-1 until expanded to full height of screen
      // Can we use refs here?
      console.log('HERE', cardOneRef, cardTwoRef)
    }
    // TODO: Decrease height of card-1 if dragging down
  }

  return (
    <Container className="entry-drawers">
      {reviews && reviews.length > 0 && (
        <EntryImages className="entry-images-container">
          <Card
            setRef={setCardOneRef}
            className="entry-images-card"
            config={{
              ...config,
              cssClass: `entry-images-card`,
              parentElement: '.entry-images-container',
            }}
          >
            <EntryImagesCard image={reviews?.[0]?.photos?.[0].medium} />
          </Card>
        </EntryImages>
      )}
      <EntryMainCard className="entry-main-card-container">
        <Card
          setRef={setCardTwoRef}
          className="entry-main-card"
          config={{
            ...config,
            breaks: {
              ...config.breaks,
              ...{ top: { ...config.breaks.top, height: 200 } },
            },
            onDrag: (e) => onDrag(2, e),
            cssClass: `entry-main-card`,
            showDraggable: true,
            parentElement: '.entry-main-card-container',
          }}
        >
          <Entry
            isInDrawer
            locationData={locationData}
            reviews={reviews}
            isLoading={isLoading}
            entryOverview={entryOverview}
            entryReviews={entryReviews}
          />
        </Card>
      </EntryMainCard>
    </Container>
  )
}

export default EntryDrawer
