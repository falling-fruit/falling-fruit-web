import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { fetchLocationData } from '../../redux/locationSlice'
import { setInitialView } from '../../redux/mapSlice'
import { fetchReviewData } from '../../redux/reviewSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { viewFromCurrentUrl } from '../../utils/appUrl'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectReview = ({ reviewId }) => {
  const dispatch = useDispatch()
  const { initialView } = useSelector((state) => state.map)
  const isDesktop = useIsDesktop()
  const { location } = useSelector((state) => state.location)
  const { review } = useSelector((state) => state.review)
  const history = useAppHistory()
  const { t } = useTranslation()

  useEffect(() => {
    if (review && review.id === reviewId && initialView) {
      return
    }

    dispatch(fetchReviewData(reviewId)).then((action) => {
      if (fetchReviewData.rejected.match(action)) {
        history.push('/map')
        toast.error(
          t('error_message.api.fetch_review_failed', {
            id: reviewId,
            message: action.error.message || t('error_message.unknown_error'),
          }),
        )
      }

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
      const view = viewFromCurrentUrl()
      if (view) {
        dispatch(setInitialView(view))
      }
    }
  }, [!!location, !!initialView]) //eslint-disable-line

  return null
}

export default ConnectReview
