import { Camera } from '@styled-icons/boxicons-regular'
import { PlusCircle } from '@styled-icons/boxicons-solid'
import { useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components/macro'

import { JPEG_QUALITY, PHOTO_MAX_DIMENSION } from '../../constants/photo'

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

const compressImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > PHOTO_MAX_DIMENSION) {
          height = (height * PHOTO_MAX_DIMENSION) / width
          width = PHOTO_MAX_DIMENSION
        }
        if (height > PHOTO_MAX_DIMENSION) {
          width = (width * PHOTO_MAX_DIMENSION) / height
          height = PHOTO_MAX_DIMENSION
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          'image/jpeg',
          JPEG_QUALITY,
        )
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })

export const AddPhotosWeb = ({ onAddPhotos }) => {
  const pendingPhotoId = useRef(0)

  const onDrop = async (acceptedFiles) => {
    const newPhotos = await Promise.all(
      acceptedFiles.map(async (file) => {
        pendingPhotoId.current--

        const compressedFile = await compressImage(file)

        return {
          id: pendingPhotoId.current,
          name: file.path,
          image: URL.createObjectURL(compressedFile),
          isNew: true,
          isUploading: true,
          file: compressedFile,
        }
      }),
    )

    onAddPhotos(newPhotos)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop,
  })

  return (
    <StyledDropzone {...getRootProps()} isDragActive={isDragActive}>
      <input {...getInputProps()} />
      {isDragActive ? <PlusIconStyled /> : <CameraIconStyled />}
    </StyledDropzone>
  )
}
