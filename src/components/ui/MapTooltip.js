// import PropTypes from 'prop-types'
import '@reach/tooltip/styles.css'

import TooltipPopup from '@reach/tooltip'
import styled from 'styled-components'

const ListEntryWrapper = styled.div`
  position: relative;
  width: 224px;
  height: 54px;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.12);
  border-radius: 44px;
`

const MapTooltip = ({ ListEntry }) => (
  <TooltipPopup>
    <ListEntryWrapper> {ListEntry} </ListEntryWrapper>
  </TooltipPopup>
)

export default MapTooltip
