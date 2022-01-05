import styled from 'styled-components'

const FormWrapper = styled.div`
  &:not(:last-child) {
    margin-bottom: 1em;
  }
`

export const FormInputWrapper = styled(FormWrapper)`
  max-width: 400px;
`

export const FormCheckboxWrapper = styled(FormWrapper)`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 0.5em;
  }
`

export const FormButtonWrapper = styled(FormWrapper)`
  display: flex;
  flex-direction: row;
  margin: 1em 0;

  & > *:not(:last-child) {
    margin-right: 0.5em;
  }
`

export const FormRatingWrapper = styled(FormButtonWrapper)`
  flex-direction: column;

  & > *:not(:last-child) {
    margin: 0 0 0.5em;
  }
`
