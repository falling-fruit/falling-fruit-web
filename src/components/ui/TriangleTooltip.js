import '@reach/tooltip/styles.css'

import Portal from '@reach/portal'
import { TooltipPopup, useTooltip } from '@reach/tooltip'
import React from 'react'

const centered = (triggerRect, tooltipRect) => {
  const triggerCenter = triggerRect.left + triggerRect.width / 2
  const left = triggerCenter - tooltipRect.width / 2
  const maxLeft = window.innerWidth - tooltipRect.width - 2
  return {
    left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
    top: triggerRect.bottom + 8 + window.scrollY,
  }
}

const TriangleTooltip = ({ children, label, 'aria-label': ariaLabel }) => {
  const [trigger, tooltip] = useTooltip()
  // destructure off what we need to position the triangle
  const { isVisible, triggerRect } = tooltip
  return (
    <div>
      {React.cloneElement(children, trigger)}
      {isVisible && (
        // The Triangle. We position it relative to the trigger, not the popup
        // so that collisions don't have a triangle pointing off to nowhere.
        // Using a Portal may seem a little extreme, but we can keep the
        // positioning logic simpler here instead of needing to consider
        // the popup's position relative to the trigger and collisions
        <Portal>
          <div
            style={{
              position: 'absolute',
              left:
                triggerRect && triggerRect.left - 10 + triggerRect.width / 2,
              top: triggerRect && triggerRect.bottom + window.scrollY,
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid #FFF',
              zIndex: '999', // moves triangle above the tooltip
              boxShadow: 'none',
            }}
          />
        </Portal>
      )}
      <TooltipPopup
        {...tooltip}
        label={label}
        aria-label={ariaLabel}
        style={{
          width: '224px',
          height: '54px',
          background: 'white',
          borderRadius: '44px',
          border: 'none',
          boxShadow: 'none',
          marginTop: '1px',
        }}
        position={centered}
      />
    </div>
  )
}
export default TriangleTooltip
