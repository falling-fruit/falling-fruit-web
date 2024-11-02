import { equals } from 'ramda'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { addPhoto } from '../../utils/api'
import { PhotoOrganizer } from './PhotoOrganizer'

export const PhotoUploader = ({ value, onChange }) => {
  const [photos, setPhotos] = useState(value)

  // Sync changes from value into state
  useEffect(() => {
    if (!equals(photos, value)) {
      setPhotos(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // We use a useEffect rather than onChange directly in order to call setPhotos with an updater function
  // Then propagate changes to photos via onChange
  useEffect(() => {
    onChange(photos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos])

  const onOrganizerChange = async (organizerPhotos) => {
    setPhotos(organizerPhotos.map((photo) => ({ ...photo, file: null })))

    await Promise.all(
      organizerPhotos.map(async (photo) => {
        if (photo.file) {
          const oldId = photo.id

          let resp

          try {
            resp = await addPhoto(photo.file)
          } catch (error) {
            toast.error(`Photo upload failed: ${error.message}`)
          }

          if (resp) {
            // Success, update id to real id and disable spinner
            const newId = resp.id

            setPhotos((oldPhotos) =>
              oldPhotos.map((photo) =>
                photo.id === oldId
                  ? {
                      ...photo,
                      id: newId,
                      isUploading: false,
                    }
                  : photo,
              ),
            )
          } else {
            // Photo upload failed, remove photo

            setPhotos((oldPhotos) =>
              oldPhotos.filter((photo) => photo.id !== oldId),
            )
          }
        }
      }),
    )
  }

  return <PhotoOrganizer photos={photos} onChange={onOrganizerChange} />
}
