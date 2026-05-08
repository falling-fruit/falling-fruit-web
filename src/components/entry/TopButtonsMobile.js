import {
  Map as MapIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
} from '@styled-icons/boxicons-solid'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import {
  reenablePaneDrawerAndSetToLowPosition,
  setPaneDrawerToMiddlePosition,
} from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { zIndex } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import ReturnIcon from '../ui/ReturnIcon'
import { useDeleteLocation } from './useDeleteLocation'

const StyledButtons = styled.div`
  position: absolute;
  inset-inline: 0;
  inset-block-start: 0;
  z-index: ${zIndex.topBar + 1};
  padding: calc(16px + env(safe-area-inset-top, 0)) 16px 16px 16px;
  display: flex;
  justify-content: space-between;
  ${({ whiteBackground }) => whiteBackground && `background: white;`}
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    inset-block-start: 0;
    height: env(safe-area-inset-top, 0);
    ${({ theme, whiteBackground }) =>
      whiteBackground && `background: ${theme.secondaryBackground};`}
  }

  button {
    pointer-events: auto;
  }

  > div {
    display: flex;

    > *:not(:last-of-type) {
      margin-inline-end: 0.5em;
    }
  }
`

const EntryButton = styled(IconButton)`
  background-color: rgba(0, 0, 0, 0.45);
  border: none;
  svg {
    color: white;
  }
  ${({ opaque }) => opaque && `opacity: 0.5; cursor: help;`}
`

EntryButton.defaultProps = {
  size: 48,
}

const TopButtonsMobile = ({ hasImages }) => {
  const dispatch = useDispatch()
  const history = useAppHistory()
  const {
    locationId,
    pane: { isStandalone, isFromEmbedViewMap },
  } = useSelector((state) => state.location)
  const { id: recentChangesSectionId } = useSelector(
    (state) => state.activity.recentChanges.lastBrowsedSection,
  )
  const { userId: userActivityUserId } = useSelector(
    (state) => state.activity.userActivityLastBrowsedSection,
  )
  const { lastViewedListId } = useSelector((state) => state.save)
  const { handleClickDelete, isDeleteVisible, isDeleteDisabled } =
    useDeleteLocation()

  const handleBack = () => {
    const standaloneBackPath = lastViewedListId
      ? '/account/lists'
      : userActivityUserId
        ? `/users/${userActivityUserId}/activity`
        : recentChangesSectionId
          ? '/changes'
          : '/list'
    history.push(standaloneBackPath)
  }

  return (
    <StyledButtons whiteBackground={!hasImages}>
      <EntryButton
        onClick={
          isStandalone
            ? handleBack
            : isFromEmbedViewMap
              ? () => history.push('/map')
              : (e) => {
                  e.stopPropagation()
                  dispatch(setPaneDrawerToMiddlePosition())
                }
        }
        icon={<ReturnIcon />}
        label="back-button"
      />
      <div>
        {isStandalone && !isFromEmbedViewMap && (
          <EntryButton
            onClick={(event) => {
              event.stopPropagation()
              dispatch(reenablePaneDrawerAndSetToLowPosition())
            }}
            icon={<MapIcon />}
            label="map-button"
          />
        )}
        {isDeleteVisible && (
          <EntryButton
            onClick={(event) => {
              event.stopPropagation()
              handleClickDelete(locationId)
            }}
            icon={<TrashIcon />}
            label="delete-button"
            opaque={isDeleteDisabled}
          />
        )}
        <EntryButton
          onClick={(event) => {
            event.stopPropagation()
            history.push(`/locations/${locationId}/edit`)
          }}
          icon={<PencilIcon />}
          label="edit-button"
        />
      </div>
    </StyledButtons>
  )
}

export default TopButtonsMobile
