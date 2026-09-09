import { Camera as CapacitorCamera } from '@capacitor/camera'
import { Camera, Images } from '@styled-icons/boxicons-regular'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { JPEG_QUALITY, PHOTO_MAX_DIMENSION } from '../../constants/photo'

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5em;
  justify-content: center;
  align-items: center;
`

const StyledButton = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25em;
  padding: 0.5em;
  flex: 1;
  max-width: 200px;
`

const IconWrapper = styled.div`
  height: 3em;
  width: 3em;
`

const CameraIconStyled = styled(Camera)`
  width: 100%;
  height: 100%;
`

const GalleryIconStyled = styled(Images)`
  width: 100%;
  height: 100%;
`

const Label = styled.span`
  font-size: 0.75em;
  text-align: center;
  white-space: nowrap;
`

export const AddPhotosCapacitor = ({ onAddPhotos }) => {
  const pendingPhotoId = useRef(0)
  const { t } = useTranslation()

  const handlePhoto = async (method) => {
    try {
      const result = await method({
        quality: JPEG_QUALITY * 100,
        editable: 'no',
        saveToGallery: true,
        targetWidth: PHOTO_MAX_DIMENSION,
        targetHeight: PHOTO_MAX_DIMENSION,
        includeMetadata: true,
      })

      let image
      if ('results' in result) {
        image = result.results[0]
      } else {
        image = result
      }

      pendingPhotoId.current--
      const fileName = image.webPath.split('/').pop()

      const newPhoto = {
        id: pendingPhotoId.current,
        name: fileName,
        image: image.webPath,
        isNew: true,
        isUploading: true,
        file: null,
        getFile: async () => {
          const response = await fetch(image.webPath)
          const blob = await response.blob()
          const file = new File([blob], fileName, {
            type: 'image/jpeg',
          })
          return file
        },
      }

      onAddPhotos([newPhoto])
    } catch (error) {
      const message = error?.message || error?.toString?.() || ''

      const isUserCancel =
        message.includes('User cancelled') ||
        message.includes('No image picked') ||
        message.includes('cancel') ||
        message.includes('aborted')

      if (!isUserCancel) {
        toast.error(
          t('error_message.api.photo_upload_failed', {
            message: message || t('error_message.unknown_error'),
          }),
        )
      }
    }
  }

  const takePicture = async () => {
    await handlePhoto(CapacitorCamera.takePhoto)
  }

  const selectFromGallery = async () => {
    await handlePhoto(CapacitorCamera.chooseFromGallery)
  }

  return (
    <ButtonContainer>
      <StyledButton onClick={takePicture}>
        <IconWrapper>
          <CameraIconStyled />
        </IconWrapper>
        <Label>{t('review.form.add_from_camera')}</Label>
      </StyledButton>
      <StyledButton onClick={selectFromGallery}>
        <IconWrapper>
          <GalleryIconStyled />
        </IconWrapper>
        <Label>{t('review.form.add_from_gallery')}</Label>
      </StyledButton>
    </ButtonContainer>
  )
}
