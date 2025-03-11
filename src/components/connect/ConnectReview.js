import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLocationData } from '../../redux/locationSlice'
import { setInitialView } from '../../redux/mapSlice'
import { fetchReviewData } from '../../redux/reviewSlice'
import { parseCurrentUrl } from '../../utils/appUrl'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectReview = ({ reviewId }) => {
  const dispatch = useDispatch()
  const { initialView } = useSelector((state) => state.map)
  const isDesktop = useIsDesktop()
  const { location } = useSelector((state) => state.location)

  useEffect(() => {
    dispatch(fetchReviewData(reviewId)).then((action) => {
      if (action.payload && !initialView && isDesktop) {
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

  useEffect(() => {
    if (location && !initialView && isDesktop) {
      const { view } = parseCurrentUrl()
      if (view) {
        dispatch(setInitialView(view))
      }
    }
  }, [!!location, !!initialView]) //eslint-disable-line

  return null
}

export default ConnectReview
