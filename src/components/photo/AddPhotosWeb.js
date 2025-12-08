import { Camera } from '@styled-icons/boxicons-regular'
import { PlusCircle } from '@styled-icons/boxicons-solid'
import { useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components/macro'

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

const compressImage = (file, maxWidth = 1200, quality = 0.8) => new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
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
          quality,
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
