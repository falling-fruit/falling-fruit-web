import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { updateEntryLocation } from '../../redux/mapSlice'
import { getLocationById } from '../../utils/api'
import Entry from './Entry'
import EntryMobile from './EntryMobile'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'

const EntryWrapper = ({ desktop }) => {
  const locationData = useSelector((state) => state.map.location)
  const dispatch = useDispatch()

  const [reviews, setReviews] = useState()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState([0, 0])
  const { id } = useParams()

  useEffect(() => {
    async function fetchEntryData() {
      setIsLoading(true)

      try {
        const locationData = await getLocationById(id, 'reviews')

        dispatch(updateEntryLocation(locationData))
        setReviews(locationData.reviews)
        setIsLoading(false)
      } catch {
        toast.error(`Entry #${id} not found`, {
          autoClose: 5000,
        })
        setIsError(true)
      }
    }

    fetchEntryData()
  }, [id, dispatch, history])

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

  const EntryComponent = desktop ? Entry : EntryMobile

  if (isError) {
    return <Redirect to="/map" />
  }

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
