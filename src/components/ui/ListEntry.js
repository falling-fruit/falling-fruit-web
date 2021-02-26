import PropTypes from 'prop-types'
import styled from 'styled-components'

const LeftIcon = styled.div`
  border-radius: 50%;
  align-self: center;
  max-width: 36px;
  max-height: 36px;
  margin: 10px 18px 11px 22px;
  overflow: hidden;
`
const PrimaryText = styled.div`
  align-items: center
  font-weight: bold;
  font-size: 14px;
  ${'' /* margin-top: 14px;
  margin-bottom: auto; */}
`
const SecondaryText = styled.div`
  align-items: center;
  font-weight: normal;
  font-size: 12px;
  ${'' /* margin-top: auto; */}
  ${'' /* margin-top: auto;
  margin-bottom: 14px; */}
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  justify-content: space-between;
`
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  margin-inline-end: auto;
  color: ${({ theme }) => theme.secondaryText};
  justify-content: center;
`
const RightIcon = styled.div`
  max-width: 16px;
  max-height: 16px;
  overflow: hidden;
  align-self: center;
  margin-right: 22px;
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
  rightIcon: PropTypes.node,
}

export default ListEntry
