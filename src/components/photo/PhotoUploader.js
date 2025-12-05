import { Capacitor } from '@capacitor/core'
import { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import { AddPhotosCapacitor } from './AddPhotosCapacitor'
import { AddPhotosWeb } from './AddPhotosWeb'
import { PhotoList } from './PhotoList'
import usePhotos from './usePhotos'

const ScrollAnchor = styled.div`
  height: 0px;
  pointer-events: none;
`

export const PhotoUploader = ({ value, onChange }) => {
  const { photos, addPhotos, reorderPhoto, removePhoto } = usePhotos(value)

  // Propagate changes to photos via onChange
  useEffect(() => {
    onChange(photos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos])

  const scrollAnchorRef = useRef(null)

  const onAddPhotos = async (newPhotos) => {
    await addPhotos(newPhotos)
    scrollAnchorRef.current?.scrollIntoView()
  }

  const isNative = Capacitor.isNativePlatform()

  return (
    <>
      <PhotoList
        photos={photos}
        reorderPhoto={reorderPhoto}
        removePhoto={removePhoto}
      />
      {isNative ? (
        <AddPhotosCapacitor onAddPhotos={onAddPhotos} />
      ) : (
        <AddPhotosWeb onAddPhotos={onAddPhotos} />
      )}
      <ScrollAnchor ref={scrollAnchorRef} />
    </>
  )
}
