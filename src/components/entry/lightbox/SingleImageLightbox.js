import { Dialog } from '@reach/dialog'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import ZoomableImage from '../../ui/ZoomableImage'
import { LightboxTopButtons } from './LightboxControls'

const VIEW_MODES = ['fullscreen', 'fullsize', 'zoomed']

const nextMode = (mode) => {
  const i = VIEW_MODES.indexOf(mode)
  return i < VIEW_MODES.length - 1 ? VIEW_MODES[i + 1] : mode
}

const prevMode = (mode) => {
  const i = VIEW_MODES.indexOf(mode)
  return i > 0 ? VIEW_MODES[i - 1] : mode
}

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

const SingleImageLightbox = ({ src, placeholderSrc, alt = '', onClose }) => {
  const [viewMode, setViewMode] = useState('fullscreen')
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)

  const isOpen = Boolean(src)

  const stepUp = useCallback(() => setViewMode((mode) => nextMode(mode)), [])
  const stepDown = useCallback(() => setViewMode((mode) => prevMode(mode)), [])

  const onImageZoomedChange = useCallback((zoomed) => {
    setIsImageZoomed(zoomed)
  }, [])

  const zoomOut = useCallback(() => {
    setViewMode(VIEW_MODES[0])
    setResetSignal((n) => n + 1)
  }, [])

  const onKeyDown = useCallback(
    ({ key }) => {
      if (key === 'Escape') {
        if (viewMode !== VIEW_MODES[0] || isImageZoomed) {
          zoomOut()
        } else {
          onClose()
        }
      }
    },
    [viewMode, isImageZoomed, zoomOut, onClose],
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

  if (!isOpen) {
    return null
  }

  return (
    <StyledDialog aria-label="Photo viewer" onDismiss={onClose}>
      <FullscreenImage
        src={src}
        placeholderSrc={placeholderSrc}
        alt={alt}
        viewMode={viewMode}
        resetSignal={resetSignal}
        onStepUp={stepUp}
        onStepDown={stepDown}
        onZoomOut={zoomOut}
        onZoomedChange={onImageZoomedChange}
      />
      <LightboxTopButtons onClose={onClose} />
    </StyledDialog>
  )
}

export default SingleImageLightbox
