import styled from 'styled-components/macro'

export const ProgressButtons = styled.div`
  margin-block-start: 16px;
  margin-block-end: 16px;
  text-align: center;

  button {
    width: 110px;

    &:not(:last-child) {
      margin-inline-end: 12px;
    }
  }
`

export const StyledForm = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 10px;
  overflow: auto;

  @media ${({ theme }) => theme.device.mobile} {
    padding-block-start: 8px;
    padding-inline: 27px;
    margin-block-start: 80px;

    textarea {
      height: 100px;

      @media (max-device-height: 600px) {
        height: 50px;
      }
    }
  }
`
