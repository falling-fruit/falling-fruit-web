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
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-block-end: 0.5em;
  }
`

export const FormButtonWrapper = styled(FormWrapper)`
  display: flex;
  flex-direction: row;
  margin: 1em 0;

  & > *:not(:last-child) {
    margin-inline-end: 0.5em;
  }
`

export const FormRatingWrapper = styled(FormButtonWrapper)`
  flex-direction: column;

  & > *:not(:last-child) {
    margin-block: 0 0.5em;
    margin-inline: 0;
  }
`

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.invalid} !important;
  margin-block-start: 0.25em;
  font-style: italic;
  font-size: 0.875rem !important;
`
