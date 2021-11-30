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
  const [showEntryImages, setShowEntryImages] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    async function fetchEntryData() {
      setIsLoading(true)

      const locationData = await getLocationById(id, 'reviews')
      setLocationData(locationData)
      setReviews(locationData.reviews)

      const showEntryImages =
        locationData.reviews && locationData.reviews[0]?.photos.length > 0
      setShowEntryImages(showEntryImages)

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

  return isInDrawer ? (
    <EntryDrawer
      showEntryImages={showEntryImages}
      locationData={locationData}
      reviews={reviews}
      isLoading={isLoading}
      entryOverview={entryOverview}
      entryReviews={entryReviews}
    />
  ) : (
    <Entry
      showEntryImages={showEntryImages}
      locationData={locationData}
      reviews={reviews}
      isLoading={isLoading}
      entryOverview={entryOverview}
      entryReviews={entryReviews}
    />
  )
}

export default EntryWrapper
