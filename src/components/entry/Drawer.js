import { useWindowSize } from '@reach/window-size'
import React from 'react'
import { a, config, useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import styled from 'styled-components/macro'

const height = 230

const DrawerWrapper = styled.div`
  position: fixed;
  height: 100vh;
  width: 100%;

  .sheet {
    z-index: 100;
    position: fixed;
    left: 0;
    height: calc(100vh + 100px);
    width: 100vw;
    background: #fff;
    touch-action: none;
    filter: drop-shadow(0px 1px 8px rgba(0, 0, 0, 0.12));
  }

  /* .sheet > .clip {
    border-radius: 44px 44px 0px;
    overflow: hidden;
    filter: drop-shadow(0px 1px 8px rgba(0, 0, 0, 0.12));
    height: 100%;
  } */

  .sheet::before {
    content: '';
    position: absolute;
    width: 2em;
    border-radius: 2px;
    top: -14px;
    height: 4px;
    background-color: ${({ theme }) => theme.secondaryBackground};
    left: calc(50% - 1em);
  }
`

export default function Drawer({ children }) {
  const [{ y }, set] = useSpring(() => ({ y: 0 }))
  const { height: _windowHeight } = useWindowSize()

  const open = ({ canceled }) => {
    // when cancel is true, it means that the user passed the upwards threshold
    // so we change the spring config to create a nice wobbly effect
    set({
      y: -height * 1.5,
      immediate: false,
      config: canceled ? config.wobbly : config.stiff,
    })
  }
  const close = (velocity = 0) => {
    set({ y: 0, immediate: false, config: { ...config.stiff, velocity } })
  }

  const bind = useDrag(
    ({ last, vxvy: [, vy], movement: [, my], cancel, canceled }) => {
      // if the user drags up passed a threshold, then we cancel
      // the drag so that the sheet resets to its open position
      if (my < -height * 1.5 - 70) {
        cancel()
      }

      // when the user releases the sheet, we check whether it passed
      // the threshold for it to close, or if we reset it to its open position
      if (last) {
        vy > 0.5 ? close(vy) : open({ canceled })
      }

      // when the user keeps dragging, we just move the sheet according to
      // the cursor position
      else {
        set({ y: my, immediate: true })
      }
    },
    {
      initial: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    },
  )

  const display = y.to((py) => (py < height ? 'block' : 'none'))

  return (
    <DrawerWrapper>
      <a.div
        className="sheet"
        {...bind()}
        style={{ display, bottom: `calc(-100vh + ${height - 100}px)`, y }}
      >
        <div className="clip">{children}</div>
      </a.div>
    </DrawerWrapper>
  )
}
