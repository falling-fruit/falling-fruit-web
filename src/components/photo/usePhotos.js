import { equals } from 'ramda'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { addPhoto } from '../../utils/api'

export default (initialPhotos = []) => {
  const [photos, setPhotos] = useState(initialPhotos)
  const { t } = useTranslation()

  // Sync changes from initialPhotos into state
  useEffect(() => {
    if (!equals(photos, initialPhotos)) {
      setPhotos(initialPhotos)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPhotos])

  const uploadPhotos = async (photosToUpload) => {
    const results = await Promise.all(
      photosToUpload.map(async (photo) => {
        if (!photo.file && !photo.getFile) {
          return { oldId: photo.id, success: true, photo }
        }

        const oldId = photo.id

        try {
          // If getFile callback exists, retrieve the file first
          let fileToUpload = photo.file
          if (photo.getFile && !fileToUpload) {
            fileToUpload = await photo.getFile()

            // Update photo state to show it's now uploading (not just loading)
            setPhotos((oldPhotos) =>
              oldPhotos.map((p) =>
                p.id === oldId
                  ? {
                      ...p,
                      isUploading: true,
                      file: fileToUpload,
                    }
                  : p,
              ),
            )
          }

          if (!fileToUpload) {
            throw new Error('No file available to upload')
          }

          const resp = await addPhoto(fileToUpload)
          return {
            oldId,
            success: true,
            newId: resp.id,
            photo: {
              ...photo,
              id: resp.id,
              isUploading: false,
              file: null,
              getFile: null,
            },
          }
        } catch (error) {
          toast.error(
            t('error_message.api.photo_upload_failed', {
              message: error.message || t('error_message.unknown_error'),
            }),
          )
          return { oldId, success: false }
        }
      }),
    )

    return results
  }

  const addPhotos = async (newPhotos) => {
    // Set photos with uploading state
    setPhotos((oldPhotos) => [
      ...oldPhotos,
      ...newPhotos.map((photo) => ({
        ...photo,
        file: photo.file || null,
      })),
    ])

    const results = await uploadPhotos(newPhotos)

    // Update photos based on upload results
    setPhotos((oldPhotos) => {
      let updatedPhotos = [...oldPhotos]

      results.forEach((result) => {
        if (result.success && result.newId) {
          // Update with new ID and mark as not uploading
          updatedPhotos = updatedPhotos.map((photo) =>
            photo.id === result.oldId ? result.photo : photo,
          )
        } else if (!result.success) {
          // Remove failed uploads
          updatedPhotos = updatedPhotos.filter(
            (photo) => photo.id !== result.oldId,
          )
        }
      })

      return updatedPhotos
    })
  }

  const reorderPhoto = (startIndex, endIndex) => {
    setPhotos((oldPhotos) => {
      const result = Array.from(oldPhotos)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }

  const removePhoto = (index) => {
    setPhotos((oldPhotos) => {
      const result = Array.from(oldPhotos)
      result.splice(index, 1)
      return result
    })
  }

  return {
    photos,
    addPhotos,
    reorderPhoto,
    removePhoto,
  }
}
