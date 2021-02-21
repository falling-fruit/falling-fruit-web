import styled from 'styled-components'

const UnstyledTagList = ({ children, className }) => (
  <ul className={className}>{children}</ul>
)

const TagList = styled(UnstyledTagList)`
  padding: 0;
  list-style: none;
`

const UnstyledTag = ({ children, color, backgroundColor, className }) => (
  <li
    style={{
      color: color ?? 'default',
      backgroundColor: backgroundColor ?? 'default',
    }}
    className={className}
  >
    {children}
  </li>
)

const Tag = styled(UnstyledTag)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 12px;
  height: 23px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: bold;
  background: ${({ theme }) => theme.transparentOrange};
  color: ${({ theme }) => theme.orange};

  &:not(:last-child) {
    margin-right: 6px;
  }
`

export { Tag, TagList }
