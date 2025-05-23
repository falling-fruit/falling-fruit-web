import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'

export const Icons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 36px;
  & > *:not(:last-child) {
    margin-inline: 8px;
  }
  ${(props) =>
    props.$prepend ? `margin-inline-end: 18px` : `margin-inline-start: 18px`}
`

export const PrimaryText = styled.div`
  font-weight: bold;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.headerText};
`

export const SecondaryText = styled.div`
  font-weight: normal;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.secondaryText};
`

const ListContainer = styled.li`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 0 14px;
  height: 42px;
  align-items: center;
  &:not(:last-child) {
    border-block-end: 1px solid ${({ theme }) => theme.secondaryBackground};
  }
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.secondaryText};
  justify-content: center;
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

// Forwarding ref here seems necessary for Combobox highlighting to work
const ListEntry = React.forwardRef(
  ({ leftIcons, children, rightIcons, ...props }, ref) => (
    <ListContainer ref={ref} {...props}>
      {leftIcons && <Icons $prepend>{leftIcons}</Icons>}
      <TextContainer>{children}</TextContainer>
      {rightIcons && <Icons>{rightIcons}</Icons>}
    </ListContainer>
  ),
)

ListEntry.displayName = 'ListEntry'

ListEntry.propTypes = {
  leftIcons: PropTypes.node,
  children: PropTypes.node,
  rightIcons: PropTypes.node,
}

export default ListEntry
