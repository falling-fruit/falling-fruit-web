import styled from 'styled-components/macro'

const FormButtons = styled.div`
  margin-block-start: 1em;
  margin-block-end: 1em;
  text-align: ${({ align }) => align};

  button {
    width: 9em;

    &:not(:last-child) {
      margin-inline-end: 1em;
    }
  }
`
export default FormButtons
