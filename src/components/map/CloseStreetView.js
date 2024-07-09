import { X } from '@styled-icons/boxicons-regular'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'

const OpacityButton = styled(ResetButton)`
  background: rgba(0, 0, 0, 0.65);
  padding: 15px;
  box-shadow: 0px 4px 4px ${({ theme }) => theme.shadow};
  color: #ffffff;
  z-index: 2;
  border-radius: 0.375em;
  font-size: 1.14rem;
  cursor: pointer;
  position: relative;
`

const StreetViewUIWrapper = styled.div`
  width: calc(100% - 40px);
  display: flex;
  top: 20px;
  left: 20px;
  justify-content: space-between;
  position: absolute;

  @media ${({ theme }) => theme.device.mobile} {
    top: 100px;
  }
`

const CloseStreetView = ({ onClick }) => (
    <StreetViewUIWrapper>
      <OpacityButton onClick={onClick}>
        <X height="22.91px" />
      </OpacityButton>
    </StreetViewUIWrapper>
  )

CloseStreetView.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default CloseStreetView
