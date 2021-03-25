import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'

const Icons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 36px;
  & > *:not(:last-child) {
    margin: 0 8px;
  }
`
const PrimaryText = styled.div`
  font-weight: bold;
  font-size: 14px;
`
const SecondaryText = styled.div`
  font-weight: normal;
  font-size: 12px;
`
const ListContainer = styled.li`
  display: flex;
  flex-direction: row;
  padding: 0 14px;
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
  overflow: hidden;
  white-space: nowrap;
  div {
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const ListEntry = React.forwardRef(
  ({ leftIcons, primaryText, secondaryText, rightIcons, ...props }, ref) => (
    <ListContainer ref={ref} {...props}>
      <Icons>{leftIcons}</Icons>
      <TextContainer>
        <PrimaryText>{primaryText}</PrimaryText>
        <SecondaryText>{secondaryText}</SecondaryText>
      </TextContainer>
      <Icons>{rightIcons}</Icons>
    </ListContainer>
  ),
)

ListEntry.displayName = 'ListEntry'

ListEntry.propTypes = {
  leftIcons: PropTypes.node,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  rightIcons: PropTypes.node,
}

export default ListEntry
