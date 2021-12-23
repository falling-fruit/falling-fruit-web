import { transparentize } from 'polished'
import styled from 'styled-components/macro'

const TagList = styled.ul`
  margin: 0px;
  padding: 0;
  list-style: none;
`

const Tag = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 12px;
  height: 23px;
  padding: 0 10px;
  font-size: 0.75rem;
  font-weight: bold;
  background-color: ${({ theme, color, backgroundColor }) =>
    backgroundColor ?? transparentize(0.8, color ?? theme.orange)};
  color: ${({ theme, color }) => color ?? theme.orange};

  &:not(:last-child) {
    margin-right: 6px;
  }
`

export { Tag, TagList }
