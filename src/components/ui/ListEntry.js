import PropTypes from 'prop-types'
import styled from 'styled-components'

const LeftIcon = styled.div`
  border-radius: 50%;
  max-width: 36px;
  max-height: 36px;
  overflow: hidden;

  & > * {
    width: 100%;
    height: 100%;
  }
`
const PrimaryText = styled.div`
  align-items: center;
  font-weight: bold;
  font-size: 14px;
`
const SecondaryText = styled.div`
  align-items: center;
  font-weight: normal;
  font-size: 12px;
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 22px;
  height: 57px;
  align-items: center;
`
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.secondaryText};
  justify-content: center;
  margin-left: 18px;
  flex: 1;
`
const RightIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.blue};
`

const ListEntry = ({ leftIcon, primaryText, secondaryText, rightIcon }) => (
  <ListContainer>
    <LeftIcon>{leftIcon}</LeftIcon>
    <TextContainer>
      <PrimaryText>{primaryText}</PrimaryText>
      <SecondaryText>{secondaryText}</SecondaryText>
    </TextContainer>
    <RightIcon>{rightIcon}</RightIcon>
  </ListContainer>
)

ListEntry.propTypes = {
  leftIcon: PropTypes.node,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  // rightIcon: PropTypes.node,
}

export default ListEntry
