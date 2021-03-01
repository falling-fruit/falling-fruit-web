// import PropTypes from 'prop-types'
import '@reach/tooltip/styles.css'

import styled from 'styled-components'

import TriangleTooltip from './TriangleTooltip'

const StyledTooltip = styled(TriangleTooltip)`
  background-color: #fff;
  border: none;
  box-shadow: none;

  ${'' /* & > * {
    background-color: #FFF;
  } */}
`

const MapTooltip = ({ ListEntry }) => (
  <div>
    <StyledTooltip label={ListEntry}>
      <button style={{ fontSize: 25 }}>Location</button>
    </StyledTooltip>
  </div>
)

export default MapTooltip
