import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  ENTRY_IMAGE_HEIGHT_PX,
  NAVIGATION_BAR_HEIGHT_PX,
} from '../../constants/mobileLayout'
import { useAppHistory } from '../../utils/useAppHistory'
import BlurredSafeArea from '../mobile/BlurredSafeArea'
import LocationContent from './LocationContent'
import LocationFullPage from './LocationFullPage'
import LocationSheet from './LocationSheet'
import TopButtonsMobile from './TopButtonsMobile'
import useLocationPane from './useLocationPane'

const MIDDLE_SCREEN_RATIO = 0.7

const calculateProgress = (currentPosition, topBoundary, bottomBoundary) =>
  Math.max(
    0,
    Math.min(
      1,
      1 - (topBoundary - currentPosition) / (topBoundary - bottomBoundary),
    ),
  )

const EntryMobile = () => {
  const history = useAppHistory()
  const { reviews, isLoading } = useSelector((state) => state.location)

  const {
    drawerFullyOpen,
    drawerLow,
    tabIndex,
    fullyOpenPaneDrawer,
    setPaneDrawerToMiddlePosition,
    setPaneDrawerToLowPosition,
    setTabIndex,
  } = useLocationPane()

  const { isOpenInMobileLayout: filterOpen } = useSelector(
    (state) => state.filter,
  )

  const hasImages =
    reviews &&
    reviews.filter((review) => review.photos && review.photos.length > 0)
      .length > 0
  const hasReviews = reviews && reviews.length > 0

  const [safeAreaInsetBottom, setSafeAreaInsetBottom] = useState(0)

  // When the sheet re-mounts right after the full page, animate down from the
  // top rather than up from the bottom.
  const wasFullyOpenRef = useRef(drawerFullyOpen)
  const enterFromTop = wasFullyOpenRef.current && !drawerFullyOpen
  useEffect(() => {
    wasFullyOpenRef.current = drawerFullyOpen
  })

  const offset = hasImages ? ENTRY_IMAGE_HEIGHT_PX : NAVIGATION_BAR_HEIGHT_PX
  const [currentTranslateY, setCurrentTranslateY] = useState(
    () => window.innerHeight * MIDDLE_SCREEN_RATIO,
  )
  const progress = calculateProgress(
    currentTranslateY,
    offset,
    window.innerHeight,
  )

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-area-inset-bottom')
      .trim()

    const numericValue = parseFloat(value) || 0
    setSafeAreaInsetBottom(numericValue)
    /*
     * NOTE:
     * The value could change if we resize or rotate screen
     * and could be updated with event listeners if needed
     * The Capacitor app shouldn't resize and there's no drawer in horizontal layout
     * so enough to populate once
     */
  }, [])

  if (isLoading === null) {
    return null
  }

  if (drawerFullyOpen) {
    return (
      <>
        {hasImages && <BlurredSafeArea />}
        <LocationFullPage hasImages={hasImages}>
          <LocationContent
            isLoading={isLoading}
            hasImages={hasImages}
            hasReviews={hasReviews}
            showTabList
            tabIndex={tabIndex}
            onTabChange={setTabIndex}
            reviewCount={reviews.length}
          />
        </LocationFullPage>
        <TopButtonsMobile hasImages={hasImages} />
      </>
    )
  }

  return (
    <LocationSheet
      displayOverTopBar={!filterOpen}
      middlePositionScreenRatio={MIDDLE_SCREEN_RATIO}
      partialPositionHeightPx={NAVIGATION_BAR_HEIGHT_PX + safeAreaInsetBottom}
      position={drawerLow ? 'low' : 'middle'}
      onRequestFullyOpen={fullyOpenPaneDrawer}
      onChangeTranslateY={setCurrentTranslateY}
      enterFromTop={enterFromTop}
      onPositionChange={(position) => {
        if (position === 'middle') {
          setPaneDrawerToMiddlePosition()
        } else if (position === 'low') {
          setPaneDrawerToLowPosition()
        } else if (position === 'bottom') {
          history.push('/map')
        } else {
          console.error(position)
        }
      }}
      hasWhiteBackground={!isLoading && hasImages}
    >
      <LocationContent
        isLoading={isLoading}
        hasImages={hasImages}
        hasReviews={hasReviews}
        showTabList={false}
        tabIndex={tabIndex}
        onTabChange={setTabIndex}
        reviewCount={reviews.length}
        sheetMode
        progress={progress}
        isDrawerFullyOpen={false}
      />
    </LocationSheet>
  )
}

export default EntryMobile
