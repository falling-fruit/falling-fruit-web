// import PropTypes from 'prop-types'
import '@reach/tooltip/styles.css'

import { Tooltip } from '@reach/tooltip'
import styled from 'styled-components'

const ListEntryWrapper = styled.div`
  position: relative;
  width: 224px;
  height: 54px;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.12);
  border-radius: 44px;
`
const StyledTooltip = styled(Tooltip)`
  background-color: #fff;
  border: none;
  box-shadow: none;

  ${'' /* & > * {
    background-color: #FFF;
  } */}
`

const MapTooltip = ({ ListEntry }) => (
  <div>
    <StyledTooltip label={<ListEntryWrapper> {ListEntry} </ListEntryWrapper>}>
      <button style={{ fontSize: 25 }}>Location</button>
    </StyledTooltip>
  </div>
)

export default MapTooltip
