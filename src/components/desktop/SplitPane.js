import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`

const LeftPane = styled.div`
  position: relative;
  flex: none;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  box-shadow: ${({ $isRTL }) => ($isRTL ? '-2px' : '2px')} 0px 8px
    ${({ theme }) => theme.shadow};
`

const RightPane = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
`

const Divider = styled.div`
  flex: none;
  width: 10px;
  margin: 0 -5px;
  height: 100%;
  cursor: col-resize;
  z-index: 1;
  user-select: none;
  touch-action: none;
`

const SplitPane = ({
  minSize,
  maxSize,
  defaultSize,
  children: [left, right],
}) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  const [width, setWidth] = useState(() => clamp(defaultSize, minSize, maxSize))

  const dragStateRef = useRef(null)
  const frameRef = useRef(null)
  const pendingXRef = useRef(null)

  useEffect(() => {
    setWidth((current) => clamp(current, minSize, maxSize))
  }, [minSize, maxSize])

  const applyPointer = useCallback(
    (clientX) => {
      const drag = dragStateRef.current
      if (!drag) {
        return
      }
      const delta = (clientX - drag.startX) * (isRTL ? -1 : 1)
      setWidth(clamp(drag.startWidth + delta, minSize, maxSize))
    },
    [minSize, maxSize, isRTL],
  )

  const handlePointerMove = useCallback(
    (event) => {
      if (!dragStateRef.current) {
        return
      }
      event.preventDefault()
      pendingXRef.current = event.clientX
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = null
          if (pendingXRef.current != null) {
            applyPointer(pendingXRef.current)
          }
        })
      }
    },
    [applyPointer],
  )

  const stopDragging = useCallback(() => {
    dragStateRef.current = null
    if (frameRef.current != null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    pendingXRef.current = null
  }, [])

  const handlePointerDown = useCallback(
    (event) => {
      event.preventDefault()
      event.currentTarget.setPointerCapture?.(event.pointerId)
      dragStateRef.current = {
        startX: event.clientX,
        startWidth: width,
      }
    },
    [width],
  )

  useEffect(() => stopDragging, [stopDragging])

  return (
    <Container>
      <LeftPane $isRTL={isRTL} style={{ width: `${width}px` }}>
        {left}
      </LeftPane>
      <Divider
        role="separator"
        aria-orientation="vertical"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      />
      <RightPane>{right}</RightPane>
    </Container>
  )
}

SplitPane.propTypes = {
  minSize: PropTypes.number.isRequired,
  maxSize: PropTypes.number.isRequired,
  defaultSize: PropTypes.number.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
}

export default SplitPane
