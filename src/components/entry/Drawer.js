import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { animated, useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import styled from 'styled-components/macro'

const windowHeight = window.innerHeight

const OPEN_NAV_SIZE = 0.75

const MainContainer = styled.div`
  position: absolute;
  height: 100%;
  overflow: hidden;
  width: 100%;
  bottom: 80px;
  left: 0;
`

const Overflow = styled.div`
  position: absolute;
  background-color: white;
  width: 100%;
  bottom: 0px;
  top: 0;
  ${({ open }) =>
    open ? 'overflow: hidden; border-radius: 44px 44px 0 0' : ''};

  & > button#toggle {
    margin: 0;
    width: 100%;
    background: none;
    border: none;
    /* height: 3em; */

    &::before {
      content: '';
      height: 6px;
      width: 4em;
      position: absolute;
      top: ${({ open }) => (open ? '1em' : '-1em')};
      left: calc(50% - 2em);
      background: ${({ theme }) => theme.secondaryText};
      border-radius: 3px;
    }
    &::after {
      content: '';
      height: 6em;
      width: 100%;
      position: absolute;
      top: -3em;
      cursor: pointer;
    }
  }

  *:not(#toggle) {
    pointer-events: ${({ open }) => (open ? 'auto' : 'none !important')};
  }
`

const EntryWrapper = styled.div`
  /* margin: 20vh 0; */
  height: 100%;
  overflow: auto;
`

const Container = styled(animated.div)`
  position: absolute;
  z-index: 999;
  width: 100%;
  max-height: ${OPEN_NAV_SIZE * windowHeight}px;
  height: 100%;

  &:after {
    content: '';
    position: absolute;
    bottom: -${windowHeight * 0.04}px;
    height: ${windowHeight * 0.04}px;
    width: 100%;
    background-color: ${({ backgroundColor }) => backgroundColor || '#c3cfe2'};
  }
`

// data-pull should be set on element that can be pulled
const canPull = (element) => {
  if (element && element.dataset && element.dataset.pull) {
    return true
  } else if (element.parentNode) {
    return canPull(element.parentNode)
  }

  return false
}

const PullContainer = forwardRef(
  ({ children, overflowHeight, onChange, className }, ref) => {
    const trans = (y) => `translateY(${y}px)`
    const topInterpolate = (px) => `calc(100% - ${px}px)`
    const [open, setOpen] = useState(false)
    const refContainer = useRef()

    const [styleProps, set] = useSpring(() => ({
      y: 0,
      top: overflowHeight,
      config: {
        mass: 1,
        tension: 350,
        friction: 40,
      },
    }))

    const setContainerOpen = (shouldOpen) => {
      if (shouldOpen === open) {
        return
      }

      if (shouldOpen) {
        set({
          top: 0,
          y: -OPEN_NAV_SIZE * windowHeight,
        })
      } else {
        set({
          top: overflowHeight,
          y: 0,
        })
      }
      setOpen(shouldOpen)
    }

    useImperativeHandle(ref, () => ({
      setOpen(shouldOpen) {
        setContainerOpen(shouldOpen)
      },
    }))

    useEffect(() => {
      set({ top: overflowHeight })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overflowHeight])

    const bind = useDrag(({ down, movement, cancel, event }) => {
      if (event.persist) {
        event.persist()
        if (event.target && !canPull(event.target)) {
          cancel()
        }
      }

      const { top } = refContainer.current.getBoundingClientRect()
      let setTop = overflowHeight
      let setY = movement[1]
      const percentOverflow = (overflowHeight * 100) / windowHeight
      const percentOpened = ((windowHeight - top) / windowHeight) * 100

      // If not down -> if release pull
      if (!down) {
        // If already open and percent openend is less than the opened percentage + 10
        // Else let open
        if (open) {
          if (percentOpened < OPEN_NAV_SIZE * 100 - 10) {
            setY = 0
            setOpen(false)
            onChange(false)
          } else {
            setY = -OPEN_NAV_SIZE * windowHeight
            setTop = 0
          }
          // If not open and open more than 5% of overflow then open it
          // Else stay closed
        } else if (percentOpened > percentOverflow + 5) {
          setY = -OPEN_NAV_SIZE * windowHeight
          setTop = 0
          setOpen(true)
          onChange(true)
        } else {
          setY = 0
        }
      } else {
        // If is pulling and pull to bottom or top more than 2% then cancel
        // If is pulling and open, set top to opened value
        if (open) {
          setTop = OPEN_NAV_SIZE * windowHeight
        }
        if (percentOpened < 0 || percentOpened > OPEN_NAV_SIZE * 100 + 2) {
          cancel()
        }
      }
      set({
        y: setY,
        top: setTop,
      })
    })

    return (
      <Container
        className={className}
        ref={refContainer}
        {...bind()}
        style={{
          transform: styleProps.y.interpolate(trans),
          top: styleProps.top.interpolate(topInterpolate),
        }}
      >
        <Overflow open={open}>
          <button
            id="toggle"
            data-_pull
            onClick={() => setContainerOpen(!open)}
          />
          <EntryWrapper
            onClick={() => !open && setContainerOpen(true)}
            role={!open && 'button'}
            tabIndex={-1}
            onKeyDown={() => !open && console.log('entered')}
          >
            {children}
          </EntryWrapper>
        </Overflow>
      </Container>
    )
  },
)

PullContainer.defaultProps = {
  overflowHeight: 0,
  children: null,
  // eslint-disable-next-line no-empty-function
  onChange: () => {},
}

PullContainer.displayName = 'PullContainer'

export default function Drawer({ children }) {
  return (
    <MainContainer>
      <PullContainer overflowHeight={275}>{children}</PullContainer>
    </MainContainer>
  )
}