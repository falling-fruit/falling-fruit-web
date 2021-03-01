// import PropTypes from 'prop-types'
import '@reach/tooltip/styles.css'

import styled from 'styled-components'

import TriangleTooltip from './TriangleTooltip'

const TooltipWrapper = styled.div`
  ${'' /* TODO: Figure out how to add a drop shadow to whole element */}
  ${'' /* webkitFilter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.12)); */}
  ${'' /* webkitFilter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.12)); */}
  ${'' /* boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.12'; */}
  border: 5px;
`

const MapTooltip = ({ ListEntry }) => (
  <TooltipWrapper>
    <TriangleTooltip label={ListEntry}>
      <button style={{ fontSize: 25 }}>Location</button>
    </TriangleTooltip>
  </TooltipWrapper>
)

export default MapTooltip
