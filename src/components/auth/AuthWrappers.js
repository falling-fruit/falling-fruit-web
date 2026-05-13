import styled from 'styled-components'

const FormWrapper = styled.div`
  &:not(:last-child) {
    margin-block-end: 1em;
  }
`

export const FormInputWrapper = styled(FormWrapper)`
  max-width: 400px;
`

export const FormCheckboxWrapper = styled(FormWrapper)`
  & > *:not(:last-child) {
    margin-block-end: 0.5em;
  }
`

export const FormButtonWrapper = styled(FormWrapper)`
  margin: 1em 0;
  & > *:not(:last-child) {
    margin-inline-end: 0.5em;
  }
`

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.invalid} !important;
  margin-block-start: 0.25em;
  font-style: italic;
  font-size: 0.875rem !important;
`
