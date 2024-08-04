import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLocationData } from '../../redux/locationSlice'
import { setInitialView } from '../../redux/mapSlice'
import { fetchReviewData } from '../../redux/reviewSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectReview = ({ reviewId }) => {
  const dispatch = useDispatch()
  const { googleMap } = useSelector((state) => state.map)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    dispatch(fetchReviewData(reviewId)).then((action) => {
      if (action.payload && !googleMap && isDesktop) {
        const locationId = action.payload.location_id
        dispatch(fetchLocationData({ locationId, isBeingEdited: false })).then(
          (locationAction) => {
            if (locationAction.payload) {
              dispatch(
                setInitialView({
                  center: {
                    lat: locationAction.payload.lat,
                    lng: locationAction.payload.lng,
                  },
                  zoom: 16,
                }),
              )
            }
          },
        )
      }
    })
  }, [dispatch, reviewId]) //eslint-disable-line

  return null
}

export default ConnectReview
