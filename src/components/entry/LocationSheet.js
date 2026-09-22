import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { zIndex } from '../ui/GlobalStyle'

const SheetContainer = styled.div`
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  background-color: white;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  touch-action: none;
  max-width: 100%;
  height: 100%;
  z-index: ${(props) =>
    props.displayOverTopBar ? zIndex.topBar + 1 : zIndex.topBar - 1};
  transition: transform 0.3s linear;
  background: ${(props) => (props.hasWhiteBackground ? 'white' : 'none')};
  padding-block-start: ${(props) => (props.hasWhiteBackground ? '0' : '10px')};
`

const DragHandle = styled.div`
  width: 40px;
  height: 5px;
  background-color: #ccc;
  border-radius: 3px;
  margin: 10px auto;
`

const POSITIONS = {
  MIDDLE: 'middle',
  LOW: 'low',
  BOTTOM: 'bottom',
}

// Use the layout viewport, which matches the CSS dvh/env() layout. The
// visualViewport is used only as a change signal (URL bar, keyboard, rotation).
const getViewportHeight = () => window.innerHeight

const LocationSheet = ({
  children,
  position,
  onPositionChange,
  onRequestFullyOpen,
  middlePositionScreenRatio,
  partialPositionHeightPx,
  onChangeTranslateY,
  hasWhiteBackground,
  displayOverTopBar,
  enterFromTop,
}) => {
  const sheetRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startTranslateY, setStartTranslateY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(getViewportHeight)

  // Recent pointer samples, used to estimate release velocity (flick) in
  // handleEnd.
  const lastSamplesRef = useRef([])

  // Lightbox is a Dialog portaled to <body>, so its clicks must not count as
  // taps outside the sheet.
  const lightboxOpen = useSelector((state) => state.location.lightbox.isOpen)

  const getSnapTranslateY = useCallback(
    (pos, height = viewportHeight) => {
      switch (pos) {
        case POSITIONS.MIDDLE:
          return height * middlePositionScreenRatio
        case POSITIONS.LOW:
          return height - partialPositionHeightPx
        case POSITIONS.BOTTOM:
        default:
          return height
      }
    },
    [viewportHeight, middlePositionScreenRatio, partialPositionHeightPx],
  )

  const movePane = useCallback(
    (transition, translateY, reportTranslateY = true) => {
      if (!sheetRef.current) {
        return
      }
      sheetRef.current.style.transition = transition
      sheetRef.current.style.transform = `translateY(${translateY}px)`
      if (reportTranslateY) {
        onChangeTranslateY?.(translateY)
      }
    },
    [onChangeTranslateY],
  )

  const inferCurrentPosition = useCallback(() => {
    const paneTop = sheetRef.current.getBoundingClientRect().top
    const height = viewportHeight
    const middle = getSnapTranslateY(POSITIONS.MIDDLE, height)
    const low = getSnapTranslateY(POSITIONS.LOW, height)

    // Above MIDDLE means the user is pulling towards fully-open.
    const fullyOpenThreshold = middle / 2
    const middleThreshold = (middle + low) / 2
    const lowThreshold = (low + height) / 2

    if (paneTop < fullyOpenThreshold) {
      return 'top'
    } else if (paneTop < middleThreshold) {
      return POSITIONS.MIDDLE
    } else if (paneTop < lowThreshold) {
      return POSITIONS.LOW
    } else {
      return POSITIONS.BOTTOM
    }
  }, [viewportHeight, getSnapTranslateY])

  // Place the sheet at its target position, animating in on first appearance.
  useLayoutEffect(() => {
    const pane = sheetRef.current
    if (!pane) {
      return
    }

    const paneIsOnScreen = !!pane.style.transform
    const target = getSnapTranslateY(position)

    if (!paneIsOnScreen) {
      // Animate in from the top when arriving from the fully-open page,
      // otherwise slide up from the bottom edge. Don't report the start frame.
      const startTy = enterFromTop ? 0 : getSnapTranslateY(POSITIONS.BOTTOM)
      movePane('none', startTy, false)
      requestAnimationFrame(() => {
        movePane('transform 0.3s linear', target)
      })
    } else {
      movePane('transform 0.3s linear', target)
    }
  }, [position, getSnapTranslateY, movePane, enterFromTop])

  // Keep snap points in sync with the dynamic viewport (URL bar, rotation,
  // keyboard).
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) {
      return undefined
    }
    const handleResize = () => {
      const height = getViewportHeight()
      setViewportHeight(height)
      if (!isDragging && sheetRef.current) {
        movePane('none', getSnapTranslateY(position, height))
      }
    }
    viewport.addEventListener('resize', handleResize)
    return () => viewport.removeEventListener('resize', handleResize)
  }, [position, isDragging, getSnapTranslateY, movePane])

  const handleStart = (clientY) => {
    setIsDragging(true)
    setStartY(clientY)
    setStartTranslateY(sheetRef.current.getBoundingClientRect().top)
    lastSamplesRef.current = [{ y: clientY, t: performance.now() }]
  }

  const handleMove = (clientY) => {
    if (!isDragging) {
      return
    }
    const deltaY = clientY - startY
    const newTranslateY = Math.max(0, startTranslateY + deltaY)
    movePane('none', newTranslateY)

    // Keep a short window of recent samples for velocity estimation.
    const samples = lastSamplesRef.current
    samples.push({ y: clientY, t: performance.now() })
    if (samples.length > 3) {
      samples.shift()
    }
  }

  // Vertical release velocity in px/ms. Negative means moving upward.
  const getReleaseVelocity = () => {
    const samples = lastSamplesRef.current
    if (samples.length < 2) {
      return 0
    }
    const first = samples[0]
    const last = samples[samples.length - 1]
    const dt = last.t - first.t
    if (dt <= 0) {
      return 0
    }
    return (last.y - first.y) / dt
  }

  // A flick faster than this (px/ms) promotes the sheet a step; slower drags
  // snap to nearest.
  const FLICK_VELOCITY_THRESHOLD = 0.5

  const stepPosition = (from, direction) => {
    const order = ['top', POSITIONS.MIDDLE, POSITIONS.LOW, POSITIONS.BOTTOM]
    const index = order.indexOf(from)
    if (index === -1) {
      return from
    }
    const nextIndex = Math.min(
      order.length - 1,
      Math.max(0, index + (direction === 'up' ? -1 : 1)),
    )
    return order[nextIndex]
  }

  const handleEnd = () => {
    if (!isDragging) {
      return
    }
    setIsDragging(false)
    const restingPosition = inferCurrentPosition()

    // A fast flick promotes the sheet one step in the direction of travel.
    const velocity = getReleaseVelocity()
    let newPosition = restingPosition
    if (velocity <= -FLICK_VELOCITY_THRESHOLD) {
      newPosition = stepPosition(restingPosition, 'up')
    } else if (velocity >= FLICK_VELOCITY_THRESHOLD) {
      newPosition = stepPosition(restingPosition, 'down')
    }

    if (newPosition === 'top') {
      // Animate the rest of the way to the top, then hand off to the full
      // page. The page mounts CSS-anchored at the same y, so the swap is a
      // visual no-op (release-then-animate handoff).
      movePane('transform 0.3s linear', 0)
      onRequestFullyOpen()
      return
    }

    movePane('transform 0.3s linear', getSnapTranslateY(newPosition))
    if (position !== newPosition) {
      onPositionChange(newPosition)
    }
  }

  const handleTouchStart = (e) => handleStart(e.touches[0].clientY)
  const handleTouchMove = (e) => handleMove(e.touches[0].clientY)

  const handleMouseDown = (e) => handleStart(e.clientY)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleMove(e.clientY)
      }
    }
    const handleMouseUp = () => handleEnd()
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (lightboxOpen) {
        return
      }
      const currentPosition = inferCurrentPosition()
      if (
        sheetRef.current &&
        !sheetRef.current.contains(event.target) &&
        (currentPosition === POSITIONS.MIDDLE ||
          currentPosition === POSITIONS.LOW)
      ) {
        const isAnotherLocation = event.target.tagName.toLowerCase() === 'img'
        const isMapControl = event.target.closest(
          '.gm-svpc, .gm-control-active, .gmnoprint, .map-zoom-button, .gm-iv-back, .gm-iv-close, .close-street-view',
        )
        const isTopBar = event.target.closest('.top-bar')
        if (!isAnotherLocation && !isMapControl && !isTopBar) {
          event.stopPropagation()
          onPositionChange(POSITIONS.BOTTOM)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inferCurrentPosition, onPositionChange, lightboxOpen])

  return (
    <SheetContainer
      ref={sheetRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      hasWhiteBackground={hasWhiteBackground}
      displayOverTopBar={displayOverTopBar}
    >
      <DragHandle />
      {children}
    </SheetContainer>
  )
}

export default LocationSheet
