import { Camera } from '@styled-icons/boxicons-regular'
import { PlusCircle } from '@styled-icons/boxicons-solid'
import { useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components/macro'

import { PhotoList } from './PhotoList'

const StyledDropzone = styled.div`
  border: 2px dashed ${({ theme }) => theme.orange};
  border-radius: 0.375em;
  cursor: pointer;
  height: 3em;
  color: ${({ theme }) => theme.orange};
  transition: color 0.3s ease;
  padding: 0.5em;
`
const CameraIconStyled = styled(Camera)`
  width: 100%;
  height: 100%;
`

const PlusIconStyled = styled(PlusCircle)`
  width: 100%;
  height: 100%;
`

export const PhotoOrganizer = ({ photos, onChange }) => {
  const pendingPhotoId = useRef(0)

  const onDrop = (acceptedFiles) => {
    const newPhotos = acceptedFiles.map((file) => {
      pendingPhotoId.current--

      return {
        id: pendingPhotoId.current,
        name: file.path,
        image: URL.createObjectURL(file),
        isNew: true,
        isUploading: true,
        file,
      }
    })

    onChange([...photos, ...newPhotos])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    // maxSize: 5000000,
    onDrop,
  })

  return (
    <>
      <StyledDropzone {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />

        {isDragActive ? <PlusIconStyled /> : <CameraIconStyled />}
      </StyledDropzone>
      <PhotoList photos={photos} onChange={onChange} />
    </>
  )
}
