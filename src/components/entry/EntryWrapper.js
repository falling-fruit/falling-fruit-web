import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getLocationById } from '../../utils/api'
import Entry from './Entry'
import EntryDrawer from './EntryDrawer'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'

const EntryWrapper = ({ isInDrawer }) => {
  const [locationData, setLocationData] = useState()
  const [reviews, setReviews] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState([0, 0])
  const { id } = useParams()

  useEffect(() => {
    async function fetchEntryData() {
      setIsLoading(true)

      const locationData = await getLocationById(id, 'reviews')
      setLocationData(locationData)
      setReviews(locationData.reviews)

      setIsLoading(false)
    }

    fetchEntryData()
  }, [id])

  const addSubmittedReview = (submittedReview) => {
    setReviews((reviews) => [...reviews, submittedReview])
  }

  const entryOverview = <EntryOverview locationData={locationData} />
  const entryReviews = (
    <EntryReviews
      reviews={reviews}
      onReviewSubmit={addSubmittedReview}
      onImageClick={(reviewIndex, imageIndex) => {
        setIsLightboxOpen(true)
        setLightboxIndex([reviewIndex, imageIndex])
      }}
    />
  )

  const showEntryImages = reviews && reviews[0]?.photos.length > 0

  const EntryComponent = isInDrawer ? EntryDrawer : Entry

  return (
    <EntryComponent
      showEntryImages={showEntryImages}
      isLightboxOpen={isLightboxOpen}
      setIsLightboxOpen={setIsLightboxOpen}
      lightboxIndex={lightboxIndex}
      setLightboxIndex={setLightboxIndex}
      locationData={locationData}
      reviews={reviews}
      isLoading={isLoading}
      entryOverview={entryOverview}
      entryReviews={entryReviews}
    />
  )
}

export default EntryWrapper
