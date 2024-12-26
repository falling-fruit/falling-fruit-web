import styled from 'styled-components/macro'

export const ProgressButtons = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  text-align: center;

  button {
    width: 110px;

    &:not(:last-child) {
      margin-right: 12px;
    }
  }
`

export const StyledForm = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  overflow: auto;

  @media ${({ theme }) => theme.device.desktop} {
    height: 100%;
  }

  @media ${({ theme }) => theme.device.mobile} {
    padding: 8px 27px 20px;
    margin-top: 80px;

    textarea {
      height: 100px;

      @media (max-device-height: 600px) {
        height: 50px;
      }
    }
  }
`
