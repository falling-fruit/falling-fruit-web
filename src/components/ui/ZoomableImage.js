import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

const MAX_ZOOM_FACTOR = 4
const CLICK_MOVE_THRESHOLD = 6
const CLICK_TIME_THRESHOLD = 400

const Viewport = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  background-color: black;
  user-select: none;
  cursor: ${({ $canPan, $panning, $canStepUp }) =>
    $canPan
      ? $panning
        ? 'grabbing'
        : 'grab'
      : $canStepUp
        ? 'zoom-in'
        : 'default'};
`

const Image = styled.img`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  transform: translate3d(${({ $x }) => $x}px, ${({ $y }) => $y}px, 0)
    scale(${({ $scale }) => $scale});
  transform-origin: center center;
  will-change: transform;
  -webkit-user-drag: none;
`

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const ZoomableImage = ({
  src,
  alt = '',
  className,
  viewMode = 'fullscreen',
  onStepUp,
  onStepDown,
  onZoomedChange,
  resetSignal,
  ...props
}) => {
  const viewportRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [panning, setPanning] = useState(false)
  const [naturalScale, setNaturalScale] = useState(1)

  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const clickCandidate = useRef(null)
  const movedDuringGesture = useRef(false)
  const pendingZoomPoint = useRef(null)

  const maxScale = naturalScale * MAX_ZOOM_FACTOR

  const modeScale = useCallback(
    (mode) => {
      if (mode === 'fullsize') {
        return naturalScale
      }
      return 1
    },
    [naturalScale],
  )

  const clampOffset = useCallback((x, y, nextScale) => {
    const el = viewportRef.current
    if (!el) {
      return { x, y }
    }
    const { width, height } = el.getBoundingClientRect()
    const maxX = (width * (nextScale - 1)) / 2
    const maxY = (height * (nextScale - 1)) / 2
    return {
      x: clamp(x, -maxX, maxX),
      y: clamp(y, -maxY, maxY),
    }
  }, [])

  const offsetForZoomPoint = useCallback(
    (prevOffset, prevScale, nextScale, clientX, clientY) => {
      const el = viewportRef.current
      if (!el) {
        return prevOffset
      }
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const ratio = nextScale / prevScale
      const dx = clientX - centerX
      const dy = clientY - centerY
      const nextX = ratio * (prevOffset.x - dx) + dx
      const nextY = ratio * (prevOffset.y - dy) + dy
      return clampOffset(nextX, nextY, nextScale)
    },
    [clampOffset],
  )

  const measureNaturalScale = useCallback(() => {
    const el = viewportRef.current
    const img = el?.querySelector('img')
    if (!el || !img || !img.naturalWidth || !img.naturalHeight) {
      return
    }
    const { width, height } = el.getBoundingClientRect()
    if (!width || !height) {
      return
    }
    const fitScale = Math.min(
      width / img.naturalWidth,
      height / img.naturalHeight,
    )
    const fittedWidth = img.naturalWidth * fitScale
    const natural = fittedWidth > 0 ? img.naturalWidth / fittedWidth : 1
    setNaturalScale(Math.max(1, natural))
  }, [])

  useEffect(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
    setNaturalScale(1)
  }, [src])

  useEffect(() => {
    const target = modeScale(viewMode)
    const zoomPoint = pendingZoomPoint.current
    pendingZoomPoint.current = null
    setScale((prevScale) => {
      setOffset((prev) => {
        if (target <= 1) {
          return { x: 0, y: 0 }
        }
        if (zoomPoint) {
          return offsetForZoomPoint(
            prev,
            prevScale,
            target,
            zoomPoint.x,
            zoomPoint.y,
          )
        }
        return clampOffset(prev.x, prev.y, target)
      })
      return target
    })
  }, [viewMode, modeScale, clampOffset, offsetForZoomPoint])

  useEffect(() => {
    onZoomedChange?.(scale > 1.001)
  }, [scale, onZoomedChange])

  const didMountReset = useRef(false)
  useEffect(() => {
    if (!didMountReset.current) {
      didMountReset.current = true
      return
    }
    const target = modeScale(viewMode)
    setScale(target)
    setOffset((prev) =>
      target <= 1 ? { x: 0, y: 0 } : clampOffset(prev.x, prev.y, target),
    )
  }, [resetSignal]) // eslint-disable-line react-hooks/exhaustive-deps

  const canPan = scale > 1.001

  const zoomToPoint = useCallback(
    (nextScale, clientX, clientY) => {
      const el = viewportRef.current
      if (!el) {
        return
      }

      setScale((prevScale) => {
        const clampedScale = clamp(nextScale, 1, maxScale)
        setOffset((prevOffset) => {
          if (clampedScale <= 1) {
            return { x: 0, y: 0 }
          }
          return offsetForZoomPoint(
            prevOffset,
            prevScale,
            clampedScale,
            clientX,
            clientY,
          )
        })
        return clampedScale
      })
    },
    [offsetForZoomPoint, maxScale],
  )

  const handleClick = useCallback(
    (clientX, clientY) => {
      if (viewMode !== 'zoomed') {
        pendingZoomPoint.current = { x: clientX, y: clientY }
        onStepUp?.()
        return
      }
      if (scale < maxScale - 0.001) {
        const next = Math.min(scale * 1.5, maxScale)
        zoomToPoint(next, clientX, clientY)
      }
    },
    [viewMode, scale, maxScale, onStepUp, zoomToPoint],
  )

  const maybeStepDown = useCallback(
    (nextScale) => {
      const current = modeScale(viewMode)
      if (nextScale < current - 0.01) {
        onStepDown?.()
      }
    },
    [viewMode, modeScale, onStepDown],
  )

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault()
      const factor = -e.deltaY > 0 ? 1.15 : 1 / 1.15
      const next = scale * factor
      maybeStepDown(next)
      zoomToPoint(next, e.clientX, e.clientY)
    },
    [scale, zoomToPoint, maybeStepDown],
  )

  useEffect(() => {
    const el = viewportRef.current
    if (!el) {
      return undefined
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const getPinchState = () => {
    const pts = Array.from(pointers.current.values())
    if (pts.length < 2) {
      return null
    }
    const [a, b] = pts
    const dx = a.x - b.x
    const dy = a.y - b.y
    return {
      distance: Math.hypot(dx, dy),
      centerX: (a.x + b.x) / 2,
      centerY: (a.y + b.y) / 2,
    }
  }

  const onPointerDown = useCallback(
    (e) => {
      viewportRef.current?.setPointerCapture?.(e.pointerId)
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (pointers.current.size === 2) {
        movedDuringGesture.current = true
        clickCandidate.current = null
        const pinch = getPinchState()
        gesture.current = {
          type: 'pinch',
          startDistance: pinch.distance,
          startScale: scale,
        }
      } else if (pointers.current.size === 1) {
        movedDuringGesture.current = false
        clickCandidate.current = {
          x: e.clientX,
          y: e.clientY,
          time: Date.now(),
        }
        if (canPan) {
          gesture.current = {
            type: 'pan',
            startX: e.clientX,
            startY: e.clientY,
            startOffset: offset,
          }
          setPanning(true)
        }
      }
    },
    [scale, offset, canPan],
  )

  const onPointerMove = useCallback(
    (e) => {
      if (!pointers.current.has(e.pointerId)) {
        return
      }
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (clickCandidate.current) {
        const dx = e.clientX - clickCandidate.current.x
        const dy = e.clientY - clickCandidate.current.y
        if (Math.hypot(dx, dy) > CLICK_MOVE_THRESHOLD) {
          clickCandidate.current = null
          movedDuringGesture.current = true
        }
      }

      const g = gesture.current
      if (!g) {
        return
      }

      if (g.type === 'pinch' && pointers.current.size >= 2) {
        const pinch = getPinchState()
        const next = g.startScale * (pinch.distance / g.startDistance)
        maybeStepDown(next)
        zoomToPoint(next, pinch.centerX, pinch.centerY)
      } else if (g.type === 'pan') {
        const dx = e.clientX - g.startX
        const dy = e.clientY - g.startY
        setOffset(
          clampOffset(g.startOffset.x + dx, g.startOffset.y + dy, scale),
        )
      }
    },
    [zoomToPoint, clampOffset, scale, maybeStepDown],
  )

  const onPointerUp = useCallback(
    (e) => {
      const wasClickCandidate = clickCandidate.current
      pointers.current.delete(e.pointerId)

      if (pointers.current.size < 2 && gesture.current?.type === 'pinch') {
        if (pointers.current.size === 1 && canPan) {
          const remaining = Array.from(pointers.current.values())[0]
          gesture.current = {
            type: 'pan',
            startX: remaining.x,
            startY: remaining.y,
            startOffset: offset,
          }
        } else {
          gesture.current = null
        }
      }

      if (pointers.current.size === 0) {
        const wasPan = gesture.current?.type === 'pan'
        gesture.current = null
        setPanning(false)

        if (
          wasClickCandidate &&
          !movedDuringGesture.current &&
          !wasPan &&
          Date.now() - wasClickCandidate.time < CLICK_TIME_THRESHOLD
        ) {
          handleClick(wasClickCandidate.x, wasClickCandidate.y)
        }
        clickCandidate.current = null
        movedDuringGesture.current = false
      }
    },
    [canPan, offset, handleClick],
  )

  const canStepUp = viewMode !== 'zoomed' || scale < maxScale - 0.001

  return (
    <Viewport
      ref={viewportRef}
      className={className}
      $canPan={canPan}
      $panning={panning}
      $canStepUp={canStepUp}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        draggable={false}
        onLoad={measureNaturalScale}
        $x={offset.x}
        $y={offset.y}
        $scale={scale}
      />
    </Viewport>
  )
}

export default ZoomableImage
