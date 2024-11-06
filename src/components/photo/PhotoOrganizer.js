import { CloudUpload } from '@styled-icons/boxicons-regular'
import { CloudUpload as CloudUploadSolid } from '@styled-icons/boxicons-solid'
import { useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components/macro'

import { PhotoList } from './PhotoList'

const StyledDropzone = styled.div`
  border: 2px dashed ${({ theme }) => theme.orange};
  border-radius: 0.375em;

  font-size: 1.125rem;
  cursor: pointer;

  text-align: center;
  vertical-align: middle;
  height: 100px;
  line-height: 100px;
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
      <StyledDropzone {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <CloudUploadSolid
            style={{ width: '45px', height: '45px', color: '#333333' }}
          />
        ) : (
          <CloudUpload
            style={{ width: '45px', height: '45px', color: '#ffa41b' }}
          />
        )}
      </StyledDropzone>
      <PhotoList photos={photos} onChange={onChange} />
    </>
  )
}
