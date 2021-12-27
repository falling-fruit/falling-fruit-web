import styled from 'styled-components'

export const FormInputWrapper = styled.div`
  max-width: 400px;
`

export const FormCheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;

  & > *:not(:last-child) {
    margin-bottom: 0.5em;
  }
`
