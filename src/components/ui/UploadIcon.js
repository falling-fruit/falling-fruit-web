import { CloudUpload } from '@styled-icons/boxicons-regular'
import { CloudUpload as CloudUploadSolid } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

const UploadIcon = styled.div`
  width: 45px;
  height: 45px;
  color: ${({ isDragActive, theme }) =>
    isDragActive ? theme.headerText : theme.orange};
  margin: 0 auto;
  transition: color 0.3s ease;
`

const IconUploadStyled = styled(CloudUpload)`
  width: 100%;
  height: 100%;
`

const IconUploadSolidStyled = styled(CloudUploadSolid)`
  width: 100%;
  height: 100%;
`

export { IconUploadSolidStyled, IconUploadStyled, UploadIcon }
