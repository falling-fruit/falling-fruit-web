import { useState } from 'react'
import { useSelector } from 'react-redux'

import Entry from './Entry'
import EntryMobile from './EntryMobile'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'

const EntryWrapper = ({ desktop }) => {
  const {
    location: locationData,
    reviews,
    isLoading,
  } = useSelector((state) => state.location)

  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState([0, 0])

  const entryOverview = <EntryOverview locationData={locationData} />
  const entryReviews = (
    <EntryReviews
      reviews={reviews}
      onImageClick={(reviewIndex, imageIndex) => {
        setIsLightboxOpen(true)
        setLightboxIndex([reviewIndex, imageIndex])
      }}
    />
  )

  const EntryComponent = desktop ? Entry : EntryMobile

  return (
    <EntryComponent
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
