import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components/macro'

const DEFAULT_OVERSCAN = 10

const Scroller = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  position: relative;
`

const Content = styled.div`
  position: relative;
  min-width: 100%;
  width: max-content;
`

const Item = styled.div`
  position: absolute;
  inset-inline-start: 0;
  min-width: 100%;
  width: max-content;
`

const VirtualList = forwardRef(
  (
    {
      itemCount,
      itemHeight,
      renderItem,
      getItemKey,
      alwaysRenderIndices = [],
      overscan = DEFAULT_OVERSCAN,
      className,
      ...props
    },
    ref,
  ) => {
    const scrollerRef = useRef(null)
    const frameRef = useRef(null)
    const [viewport, setViewport] = useState({ scrollTop: 0, height: 0 })

    const measure = useCallback(() => {
      frameRef.current = null
      const scroller = scrollerRef.current
      if (!scroller) {
        return
      }
      setViewport((previous) =>
        previous.scrollTop === scroller.scrollTop &&
        previous.height === scroller.clientHeight
          ? previous
          : { scrollTop: scroller.scrollTop, height: scroller.clientHeight },
      )
    }, [])

    const scheduleMeasure = useCallback(() => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(measure)
      }
    }, [measure])

    useLayoutEffect(() => {
      measure()
    }, [measure, itemCount])

    useEffect(() => {
      const scroller = scrollerRef.current
      if (!scroller || typeof ResizeObserver === 'undefined') {
        return undefined
      }
      const observer = new ResizeObserver(scheduleMeasure)
      observer.observe(scroller)
      return () => {
        observer.disconnect()
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current)
          frameRef.current = null
        }
      }
    }, [scheduleMeasure])

    useImperativeHandle(
      ref,
      () => ({
        scrollToIndex: (index) => {
          const scroller = scrollerRef.current
          if (!scroller) {
            return
          }
          const top = index * itemHeight
          const bottom = top + itemHeight
          if (top < scroller.scrollTop) {
            scroller.scrollTop = top
          } else if (bottom > scroller.scrollTop + scroller.clientHeight) {
            scroller.scrollTop = bottom - scroller.clientHeight
          }
        },
      }),
      [itemHeight],
    )

    const first = Math.max(
      0,
      Math.floor(viewport.scrollTop / itemHeight) - overscan,
    )
    const last = Math.min(
      itemCount,
      Math.ceil((viewport.scrollTop + viewport.height) / itemHeight) + overscan,
    )

    const indices = []
    for (let index = first; index < last; index++) {
      indices.push(index)
    }
    alwaysRenderIndices.forEach((index) => {
      if (index >= 0 && index < itemCount && (index < first || index >= last)) {
        indices.push(index)
      }
    })

    return (
      <Scroller
        ref={scrollerRef}
        className={className}
        onScroll={scheduleMeasure}
        {...props}
      >
        <Content style={{ height: itemCount * itemHeight }}>
          {indices.map((index) => (
            <Item
              key={getItemKey(index)}
              style={{ top: index * itemHeight, height: itemHeight }}
            >
              {renderItem(index)}
            </Item>
          ))}
        </Content>
      </Scroller>
    )
  },
)

VirtualList.displayName = 'VirtualList'

export default VirtualList
