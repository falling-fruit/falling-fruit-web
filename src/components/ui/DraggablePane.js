import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components/macro'

import { zIndex } from '../ui/GlobalStyle'

const PaneContainer = styled.div`
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  background-color: white;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  touch-action: ${(props) => (props.isMiddlePosition ? 'none' : 'auto')};
  max-width: 100%;
  height: 100%;
  z-index: ${(props) =>
    props.displayOverTopBar ? zIndex.topBar + 1 : zIndex.topBar - 1};
  transition: transform 0.3s linear;
  background: ${(props) => (props.hasImages ? 'white' : 'none')};
  padding-block-start: ${(props) => (props.hasImages ? '0' : '10px')};
`

const DragHandle = styled.div`
  width: 40px;
  height: 5px;
  background-color: #ccc;
  border-radius: 3px;
  margin: 10px auto;
  ${(props) => !props.showMoveElement && `display: none`};
`

const POSITIONS = {
  TOP: 'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
}

const DraggablePane = ({
  children,
  position,
  onPositionChange,
  topPositionHeight,
  middlePositionScreenRatio,
  drawerDisabled,
  updateProgress,
  hasImages,
  showMoveElement,
  displayOverTopBar,
}) => {
  const isMiddlePosition = position === POSITIONS.MIDDLE
  const paneRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startTranslateY, setStartTranslateY] = useState(0)

  const movePane = useCallback(
    (transition, translateY) => {
      if (!paneRef.current) {
        return
      }
      paneRef.current.style.transition = transition
      paneRef.current.style.transform = `translateY(${translateY}px)`
      const windowHeight = window.innerHeight
      const progress = 1 + (topPositionHeight - translateY) / windowHeight
      updateProgress(progress)
    },
    [updateProgress, topPositionHeight],
  )

  const inferCurrentPosition = useCallback(() => {
    const paneTop = paneRef.current.getBoundingClientRect().top
    const windowHeight = window.innerHeight

    const topThreshold =
      topPositionHeight +
      (windowHeight * middlePositionScreenRatio - topPositionHeight) / 2
    const middleThreshold = (windowHeight * (1 + middlePositionScreenRatio)) / 2

    if (paneTop < topThreshold) {
      return POSITIONS.TOP
    } else if (paneTop < middleThreshold) {
      return POSITIONS.MIDDLE
    } else {
      return POSITIONS.BOTTOM
    }
  }, [middlePositionScreenRatio, topPositionHeight])

  useLayoutEffect(() => {
    const pane = paneRef.current
    if (!pane) {
      return
    }

    const windowHeight = window.innerHeight

    const positionToTranslateY = {
      [POSITIONS.TOP]: topPositionHeight,
      [POSITIONS.MIDDLE]: windowHeight * middlePositionScreenRatio,
      [POSITIONS.BOTTOM]: windowHeight,
    }

    if (!pane.style.transform) {
      if (position === 'POSITIONS.MIDDLE') {
        movePane('none', positionToTranslateY[POSITIONS.BOTTOM])

        // Use requestAnimationFrame to ensure the initial position is applied before animating
        requestAnimationFrame(() => {
          movePane('transform 0.3s linear', positionToTranslateY[position])
        })
      } else {
        movePane('none', positionToTranslateY[position])
      }
    } else {
      const currentTranslateY = pane.getBoundingClientRect().top
      const currentPosition = Object.entries(positionToTranslateY).reduce(
        (closest, [pos, translateY]) =>
          Math.abs(translateY - currentTranslateY) <
          Math.abs(closest[1] - currentTranslateY)
            ? [pos, translateY]
            : closest,
        ['', Infinity],
      )[0]

      if (currentPosition !== position) {
        movePane('transform 0.3s linear', positionToTranslateY[position])
      }
    }
  }, [movePane, position, topPositionHeight, middlePositionScreenRatio])

  const handleStart = (clientY) => {
    if (drawerDisabled) {
      return
    }
    setIsDragging(true)
    setStartY(clientY)
    setStartTranslateY(paneRef.current.getBoundingClientRect().top)
  }

  const handleMove = (clientY) => {
    if (!isDragging || drawerDisabled) {
      return
    }

    const deltaY = clientY - startY
    const newTranslateY = Math.max(0, startTranslateY + deltaY)

    movePane('none', newTranslateY)
  }

  const handleEnd = () => {
    if (!isDragging || drawerDisabled) {
      return
    }
    setIsDragging(false)
    const newPosition = inferCurrentPosition()
    const windowHeight = window.innerHeight

    const positionToTranslateY = {
      [POSITIONS.TOP]: topPositionHeight,
      [POSITIONS.MIDDLE]: windowHeight * middlePositionScreenRatio,
      [POSITIONS.BOTTOM]: windowHeight,
    }

    movePane('transform 0.3s linear', positionToTranslateY[newPosition])
    if (position !== newPosition) {
      onPositionChange(newPosition)
    }
  }

  const handleTouchStart = (e) => handleStart(e.touches[0].clientY)
  const handleTouchMove = (e) => handleMove(e.touches[0].clientY)
  const handleTouchEnd = (e) => handleEnd(e.changedTouches[0].clientY)

  const handleMouseDown = (e) => handleStart(e.clientY)
  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientY)
    }
  }
  const handleMouseUp = (e) => handleEnd(e.clientY)

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging]) //eslint-disable-line

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        paneRef.current &&
        !paneRef.current.contains(event.target) &&
        inferCurrentPosition() === POSITIONS.MIDDLE
      ) {
        const clickY = event.clientY
        const isAnotherLocation =
          event.target.tagName.toLowerCase() === 'button'
        const isAboveTopPosition = clickY < topPositionHeight

        if (!isAnotherLocation && !isAboveTopPosition) {
          event.stopPropagation()
          onPositionChange(POSITIONS.BOTTOM)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inferCurrentPosition, onPositionChange, topPositionHeight])

  return (
    <PaneContainer
      ref={paneRef}
      onTouchStart={isMiddlePosition ? handleTouchStart : undefined}
      onTouchMove={isMiddlePosition ? handleTouchMove : undefined}
      onTouchEnd={isMiddlePosition ? handleTouchEnd : undefined}
      onMouseDown={isMiddlePosition ? handleMouseDown : undefined}
      hasImages={hasImages}
      showMoveElement={showMoveElement}
      isMiddlePosition={isMiddlePosition}
      displayOverTopBar={displayOverTopBar}
    >
      <DragHandle showMoveElement={showMoveElement} />
      {children}
    </PaneContainer>
  )
}

export default DraggablePane
