import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  closeLightbox,
  selectReviewsWithPhotos,
  setLightboxIndices,
} from '../../../redux/locationSlice'

const VIEW_MODES = ['fullscreen', 'fullsize', 'zoomed']

const nextMode = (mode) => {
  const i = VIEW_MODES.indexOf(mode)
  return i < VIEW_MODES.length - 1 ? VIEW_MODES[i + 1] : mode
}

const prevMode = (mode) => {
  const i = VIEW_MODES.indexOf(mode)
  return i > 0 ? VIEW_MODES[i - 1] : mode
}

export const useLightbox = () => {
  const dispatch = useDispatch()
  const lightbox = useSelector((state) => state.location.lightbox)
  const reviewsWithPhotos = useSelector(selectReviewsWithPhotos)
  const { isOpen, reviewIndex, photoIndex } = lightbox

  const [viewMode, setViewMode] = useState('fullscreen')
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)

  const reviewImages = useMemo(
    () => reviewsWithPhotos.map((review) => review.photos),
    [reviewsWithPhotos],
  )

  const stepUp = useCallback(() => setViewMode((mode) => nextMode(mode)), [])
  const stepDown = useCallback(() => setViewMode((mode) => prevMode(mode)), [])
  const close = useCallback(() => dispatch(closeLightbox()), [dispatch])

  const onImageZoomedChange = useCallback((zoomed) => {
    setIsImageZoomed(zoomed)
  }, [])

  const zoomOut = useCallback(() => {
    setViewMode((mode) => prevMode(mode))
    setResetSignal((n) => n + 1)
  }, [])

  const incrementReviewImage = useCallback(() => {
    if (photoIndex + 1 < reviewImages[reviewIndex].length) {
      dispatch(setLightboxIndices({ reviewIndex, photoIndex: photoIndex + 1 }))
    } else if (reviewIndex + 1 < reviewImages.length) {
      dispatch(
        setLightboxIndices({ reviewIndex: reviewIndex + 1, photoIndex: 0 }),
      )
    }
  }, [reviewIndex, photoIndex, dispatch, reviewImages])

  const decrementReviewImage = useCallback(() => {
    if (photoIndex === 0) {
      if (reviewIndex > 0) {
        dispatch(
          setLightboxIndices({
            reviewIndex: reviewIndex - 1,
            photoIndex: reviewImages[reviewIndex - 1].length - 1,
          }),
        )
      }
    } else {
      dispatch(setLightboxIndices({ reviewIndex, photoIndex: photoIndex - 1 }))
    }
  }, [reviewIndex, photoIndex, dispatch, reviewImages])

  const onKeyDown = useCallback(
    ({ key }) => {
      if (key === 'ArrowRight') {
        incrementReviewImage()
      } else if (key === 'ArrowLeft') {
        decrementReviewImage()
      } else if (key === 'Escape') {
        if (viewMode !== VIEW_MODES[0] || isImageZoomed) {
          zoomOut()
        } else {
          close()
        }
      }
    },
    [
      incrementReviewImage,
      decrementReviewImage,
      close,
      zoomOut,
      viewMode,
      isImageZoomed,
    ],
  )

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setViewMode('fullscreen')
    }
  }, [isOpen])

  useEffect(() => {
    setViewMode('fullscreen')
  }, [reviewIndex, photoIndex])

  const currentSrc = reviewImages[reviewIndex]?.[photoIndex]?.original ?? ''
  const hasMultiple = reviewImages.length > 1

  const isFirst = reviewIndex === 0 && photoIndex === 0
  const isLast =
    reviewImages.length > 0 &&
    reviewIndex === reviewImages.length - 1 &&
    photoIndex === reviewImages[reviewImages.length - 1].length - 1

  const canZoomOut = viewMode !== VIEW_MODES[0] || isImageZoomed

  return {
    viewMode,
    isOpen,
    currentSrc,
    hasMultiple,
    isFirst,
    isLast,
    canZoomOut,
    resetSignal,
    stepUp,
    stepDown,
    zoomOut,
    close,
    onImageZoomedChange,
    incrementReviewImage,
    decrementReviewImage,
  }
}
