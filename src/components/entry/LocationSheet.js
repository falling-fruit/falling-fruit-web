import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
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

/**
 * Read the height of the visual viewport, falling back to the layout
 * viewport. The visual viewport tracks the *dynamic* mobile viewport
 * (collapsing URL bar, on-screen keyboard) so the sheet's snap points
 * agree with the dvh/env()-based layout used by the rest of the app.
 */
const getViewportHeight = () =>
  (window.visualViewport && window.visualViewport.height) || window.innerHeight

/**
 * Bottom sheet for the location entry, shown when the drawer is NOT fully
 * open. It only knows three positions: MIDDLE (default peek), LOW (small
 * peek) and BOTTOM (dismissed -> back to map). Reaching the top is not this
 * component's concern: dragging past MIDDLE hands off to the full page shell
 * via onRequestFullyOpen.
 */
const LocationSheet = ({
  children,
  position, // 'middle' | 'low'
  onPositionChange,
  onRequestFullyOpen,
  middlePositionScreenRatio,
  partialPositionHeightPx,
  hasWhiteBackground,
  displayOverTopBar,
}) => {
  const sheetRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startTranslateY, setStartTranslateY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(getViewportHeight)

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

  const movePane = useCallback((transition, translateY) => {
    if (!sheetRef.current) {
      return
    }
    sheetRef.current.style.transition = transition
    sheetRef.current.style.transform = `translateY(${translateY}px)`
  }, [])

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

  // Place the sheet at its target position, animating in from the bottom the
  // first time it appears.
  useLayoutEffect(() => {
    const pane = sheetRef.current
    if (!pane) {
      return
    }

    const paneIsOnScreen = !!pane.style.transform
    const target = getSnapTranslateY(position)

    if (!paneIsOnScreen) {
      // Animate up from the bottom edge on first mount.
      movePane('none', getSnapTranslateY(POSITIONS.BOTTOM))
      requestAnimationFrame(() => {
        movePane('transform 0.3s linear', target)
      })
    } else {
      movePane('transform 0.3s linear', target)
    }
  }, [position, getSnapTranslateY, movePane])

  // Keep snap points in sync with the dynamic viewport (URL bar, rotation,
  // keyboard). Re-snap to the current logical position when it changes.
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
  }

  const handleMove = (clientY) => {
    if (!isDragging) {
      return
    }
    const deltaY = clientY - startY
    const newTranslateY = Math.max(0, startTranslateY + deltaY)
    movePane('none', newTranslateY)
  }

  const handleEnd = () => {
    if (!isDragging) {
      return
    }
    setIsDragging(false)
    const newPosition = inferCurrentPosition()

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

  // Tap outside the sheet while at MIDDLE dismisses it back to the map.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(event.target) &&
        inferCurrentPosition() === POSITIONS.MIDDLE
      ) {
        const isAnotherLocation = event.target.tagName.toLowerCase() === 'img'
        const isMapControl = event.target.closest(
          '.gm-svpc, .gm-control-active, .gmnoprint',
        )
        if (!isAnotherLocation && !isMapControl) {
          event.stopPropagation()
          onPositionChange(POSITIONS.BOTTOM)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inferCurrentPosition, onPositionChange])

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
