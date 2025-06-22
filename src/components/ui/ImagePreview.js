import { LoaderAlt, X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import ResetButton from './ResetButton'
import Spinner from './Spinner'

const DeleteButton = styled(ResetButton)`
  position: absolute;
  height: 24px;
  width: 24px;
  inset-block-start: -12px;
  inset-inline-end: -12px;
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
  width: ${(props) => (props.$small ? '48px' : '70px')};
  height: ${(props) => (props.$small ? '48px' : '70px')};
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background};
  overflow: visible;

  ${Spinner} {
    position: absolute;
    top: calc(50% - 1.75rem / 2);
    left: calc(50% - 1.75rem / 2);
    color: ${({ theme }) => theme.navBackground};
  }

  & > img {
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    border-radius: 0.375em;
    width: 100%;
    height: 100%;
    object-fit: cover;

    ${({ $isUploading }) => $isUploading && 'filter: brightness(0.8);'}
  }
`

export const ImagesContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const ImagePreview = ({
  children,
  className,
  onDelete,
  isUploading,
  small,
  ...props
}) => (
  <Tile
    className={className}
    $isUploading={isUploading}
    $small={small}
    {...props}
  >
    {children}
    {isUploading && <Spinner as={LoaderAlt} />}
    {onDelete && (
      <DeleteButton onClick={onDelete}>
        <X />
      </DeleteButton>
    )}
  </Tile>
)

export default ImagePreview
