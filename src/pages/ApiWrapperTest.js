import { useEffect, useState } from 'react'

import {
  getClusters,
  getLocationById,
  getLocations,
  getReviews,
  getTypes,
  getTypesById,
  postLocations,
  postReview,
} from '../utils/api'

const ApiWrapperTest = () => {
  const [clusters, setClusters] = useState(null)
  const [locations, setLocations] = useState(null)
  const [locationById, setLocationById] = useState(null)
  const [reviews, setReviews] = useState(null)
  const [types, setTypes] = useState(null)
  const [typesById, setTypesById] = useState(null)
  const [postedLocations, setPostedLocations] = useState(null)
  const [postedReviws, setPostedReviews] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setClusters(await getClusters())
      setLocations(await getLocations())
      setLocationById(await getLocationById())
      setReviews(await getReviews())
      setTypes(await getTypes())
      setTypesById(await getTypesById())
      setPostedLocations(await postLocations())
      setPostedReviews(await postReview())
    }
    fetchData()
  }, [])

  return (
    <div>
      {types &&
        types.map((type, index) => <div key={index}>{type.en_name}</div>)}
      {clusters &&
        clusters.map((type, index) => (
          <div key={index}>{clusters.en_name}</div>
        ))}
      {locations &&
        locations.map((type, index) => (
          <div key={index}>{locations.en_name}</div>
        ))}
      {locationById &&
        locationById.map((type, index) => (
          <div key={index}>{locationById.en_name}</div>
        ))}
      {reviews &&
        reviews.map((type, index) => <div key={index}>{reviews.en_name}</div>)}
      {typesById &&
        typesById.map((type, index) => (
          <div key={index}>{typesById.en_name}</div>
        ))}
      {postedLocations &&
        postedLocations.map((type, index) => (
          <div key={index}>{postedLocations.en_name}</div>
        ))}
      {postedReviws &&
        postedReviws.map((type, index) => (
          <div key={index}>{postedReviws.en_name}</div>
        ))}
    </div>
  )
}

export default ApiWrapperTest
