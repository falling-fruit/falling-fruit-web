// import PropTypes from 'prop-types'
import '@reach/tooltip/styles.css'

import styled from 'styled-components'

import TriangleTooltip from './TriangleTooltip'

const StyledTooltip = styled(TriangleTooltip)`
  ${'' /* TODO: Figure out how to add a drop shadow to whole element */}
  ${'' /* boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.12'; */}
  webkitFilter: 'drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.12))';
`

const MapTooltip = ({ ListEntry }) => (
  <div>
    <StyledTooltip label={ListEntry}>
      <button style={{ fontSize: 25 }}>Location</button>
    </StyledTooltip>
  </div>
)

export default MapTooltip
