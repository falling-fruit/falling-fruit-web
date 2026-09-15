import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import LocationContent from './LocationContent'
import LocationFullPage from './LocationFullPage'
import LocationSheet from './LocationSheet'
import TopButtonsMobile from './TopButtonsMobile'
import useLocationPane from './useLocationPane'

const MIDDLE_SCREEN_RATIO = 0.7
const LOW_PEEK_HEIGHT_PX = 80

// Blur strip over the safe area, shown on the full page when an image sits
// beneath the top safe area.
const BlurredSafeArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-top, 0);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.3);
  z-index: 1000;
  pointer-events: none;
`

// Fade the top buttons in as the full page appears, so they do not pop.
const FadeInTopButtons = styled.div`
  animation: location-top-buttons-fade-in 0.2s linear;

  @keyframes location-top-buttons-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

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

  const content = (
    <LocationContent
      isLoading={isLoading}
      hasImages={hasImages}
      hasReviews={hasReviews}
      showTabList={drawerFullyOpen}
      tabIndex={tabIndex}
      onTabChange={setTabIndex}
      reviewCount={reviews.length}
    />
  )

  if (drawerFullyOpen) {
    return (
      <>
        {hasImages && <BlurredSafeArea />}
        <LocationFullPage hasImages={hasImages}>{content}</LocationFullPage>
        <FadeInTopButtons>
          <TopButtonsMobile hasImages={hasImages} />
        </FadeInTopButtons>
      </>
    )
  }

  return (
    <LocationSheet
      displayOverTopBar={!filterOpen}
      middlePositionScreenRatio={MIDDLE_SCREEN_RATIO}
      partialPositionHeightPx={LOW_PEEK_HEIGHT_PX + safeAreaInsetBottom}
      position={drawerLow ? 'low' : 'middle'}
      onRequestFullyOpen={fullyOpenPaneDrawer}
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
      {content}
    </LocationSheet>
  )
}

export default EntryMobile
