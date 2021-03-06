import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledIconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  padding: 0;
  background-color: white;
  border-radius: 50%;
  border: 2px solid
    ${({ raised, theme }) => (raised ? 'white' : theme.secondaryBackground)};
  ${({ raised, theme }) =>
    raised &&
    `box-shadow: 0 0 8px 1px ${theme.shadow};
	`}

  &:focus {
    outline: none;
  }
`

const RaisedIconButtonContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: 2px solid;
  border-color: orange;
`

const IconButton = ({ size, raised, icon, onClick, label }) => (
  <StyledIconButton
    aria-label={label}
    size={size}
    raised={raised}
    onClick={onClick}
  >
    {raised ? (
      <RaisedIconButtonContainer size={size - 10}>
        {icon}
      </RaisedIconButtonContainer>
    ) : (
      icon
    )}
  </StyledIconButton>
)

IconButton.propTypes = {
  raised: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
}

export default IconButton
