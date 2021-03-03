import PropTypes from 'prop-types'
import styled from 'styled-components'

// const LIST_ENTRY_HEIGHTS = {
//   sm: "47px",
//   md: "57px",
// };

const Icons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 36px;
  & > * {
    padding: 8px;
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
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.secondaryBackground};
  }
`
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.secondaryText};
  justify-content: center;
  margin-left: 18px;
  flex: 1;
`

const ListEntry = ({ leftIcon, primaryText, secondaryText, rightIcons }) => (
  <ListContainer>
    <Icons>{leftIcon}</Icons>
    <TextContainer>
      <PrimaryText>{primaryText}</PrimaryText>
      <SecondaryText>{secondaryText}</SecondaryText>
    </TextContainer>
    <Icons>{rightIcons}</Icons>
  </ListContainer>
)

ListEntry.propTypes = {
  leftIcon: PropTypes.node,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  rightIcons: PropTypes.node,
}

export default ListEntry
