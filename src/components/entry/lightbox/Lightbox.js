import { Dialog } from '@reach/dialog'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import ZoomableImage from '../../ui/ZoomableImage'
import { LightboxNavButtons, LightboxTopButtons } from './LightboxControls'
import { useLightbox } from './useLightbox'

const StyledDialog = styled(Dialog)`
  margin: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  max-width: none;
  border-radius: 0;
  padding: 0;
  background: black;
`

const FullscreenImage = styled(ZoomableImage)`
  width: 100%;
  height: 100%;
`

const Lightbox = () => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  const {
    viewMode,
    isOpen,
    currentSrc,
    currentPlaceholderSrc,
    hasMultiple,
    isFirst,
    isLast,
    resetSignal,
    stepUp,
    stepDown,
    zoomOut,
    close,
    onImageZoomedChange,
    incrementReviewImage,
    decrementReviewImage,
  } = useLightbox()

  if (!isOpen) {
    return null
  }

  return (
    <StyledDialog aria-label="Photo viewer" onDismiss={close}>
      <FullscreenImage
        src={currentSrc}
        placeholderSrc={currentPlaceholderSrc}
        alt=""
        viewMode={viewMode}
        resetSignal={resetSignal}
        onStepUp={stepUp}
        onStepDown={stepDown}
        onZoomOut={zoomOut}
        onZoomedChange={onImageZoomedChange}
      />
      <LightboxTopButtons onClose={close} />
      {hasMultiple && (
        <LightboxNavButtons
          isRTL={isRTL}
          disablePrev={isFirst}
          disableNext={isLast}
          onPrev={decrementReviewImage}
          onNext={incrementReviewImage}
        />
      )}
    </StyledDialog>
  )
}

export default Lightbox
