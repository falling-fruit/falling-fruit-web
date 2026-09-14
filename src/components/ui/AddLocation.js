import { Plus } from '@styled-icons/boxicons-regular'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { css } from 'styled-components'
import styled from 'styled-components/macro'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../../constants/map'
import { useAppHistory } from '../../utils/useAppHistory'
import Button from './Button'
import IconButton from './IconButton'

const greyableButtonStyle = css`
  opacity: ${({ greyedOut, disabled }) =>
    greyedOut || disabled ? '0.5' : '1'};
  cursor: ${({ greyedOut, disabled }) => {
    if (disabled) {
      return 'not-allowed'
    }
    return greyedOut ? 'help' : 'pointer'
  }};
`

const StyledAddLocationButton = styled(IconButton)`
  position: absolute;
  inset-block-end: calc(10px + var(--safe-area-inset-bottom, 0px));
  inset-inline-end: 10px;
  z-index: 1;
  ${greyableButtonStyle}
`

const AddLocationDesktopButton = styled(Button)`
  margin-inline: 0.75em;
  margin-block-start: 0;
  margin-block-end: 1em;
  padding-block: 1em;
  padding-inline: 0;
  ${greyableButtonStyle}
`

const useAddLocation = (addLocationPath) => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const { googleMap } = useSelector((state) => state.map)

  const noMap = !googleMap

  const isZoomSufficient =
    !!googleMap && googleMap.getZoom() > VISIBLE_CLUSTER_ZOOM_LIMIT

  const handleAddLocation = () => {
    if (noMap) {
      return
    }
    if (isZoomSufficient) {
      history.push(addLocationPath)
    } else {
      toast.info(t('menu.zoom_in_to_add_location'))
    }
  }

  return {
    handleAddLocation,
    isZoomSufficient,
    noMap,
  }
}

export const AddLocationMobile = () => {
  const { t } = useTranslation()
  const { handleAddLocation, isZoomSufficient, noMap } =
    useAddLocation('/locations/init')

  return (
    <StyledAddLocationButton
      label={t('menu.add_new_location')}
      size={68}
      icon={<Plus />}
      raised
      onClick={handleAddLocation}
      greyedOut={!isZoomSufficient}
      disabled={noMap}
    />
  )
}

export const AddLocationDesktop = () => {
  const { t } = useTranslation()
  const { handleAddLocation, isZoomSufficient, noMap } =
    useAddLocation('/locations/new')

  return (
    <AddLocationDesktopButton
      greyedOut={!isZoomSufficient}
      disabled={noMap}
      onClick={handleAddLocation}
    >
      {t('menu.add_new_location')}
    </AddLocationDesktopButton>
  )
}

export const AddLocationEmbed = (props) => {
  const { t } = useTranslation()
  const { handleAddLocation, isZoomSufficient, noMap } =
    useAddLocation('/locations/init')

  return (
    <AddLocationDesktopButton
      secondary
      greyedOut={!isZoomSufficient}
      disabled={noMap}
      onClick={handleAddLocation}
      {...props}
    >
      {t('menu.add_new_location')}
    </AddLocationDesktopButton>
  )
}
