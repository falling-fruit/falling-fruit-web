import styled from 'styled-components/macro'

const FormTag = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 4px;
  height: 15px;
  padding: 2px;
  font-size: 9px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  background-color: #dadada;
  text-transform: uppercase;

  &:not(:last-child) {
    margin-right: 6px;
  }
`
export default FormTag
