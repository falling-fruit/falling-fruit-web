import { X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import ResetButton from './ResetButton'

const DeleteButton = styled(ResetButton)`
  position: absolute;
  height: 24px;
  width: 24px;
  top: -12px;
  right: -12px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.orange};
  z-index: 1;

  svg {
    color: ${({ theme }) => theme.background};
  }
`

const Tile = styled.div`
  position: relative;
  display: inline-block;
  width: 70px;
  height: 70px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background};
  overflow: visible;

  & > img {
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    border-radius: 7px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ImagePreview = ({ children, onDelete }) => (
  <Tile>
    {children}
    <DeleteButton onClick={onDelete}>
      <X />
    </DeleteButton>
  </Tile>
)

export default ImagePreview
