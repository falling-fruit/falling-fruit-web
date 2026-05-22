import {
  Map as MapIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
} from '@styled-icons/boxicons-solid'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import { useIsEmbed } from '../../utils/useBreakpoint'
import { zIndex } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import ReturnIcon from '../ui/ReturnIcon'
import { useDeleteLocation } from './useDeleteLocation'
import useLocationPane from './useLocationPane'

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

const RoundIconButton = styled(IconButton)`
  background-color: rgba(0, 0, 0, 0.45);
  border: none;
  svg {
    color: white;
  }
  ${({ opaque }) => opaque && `opacity: 0.5; cursor: help;`}
`

RoundIconButton.defaultProps = {
  size: 48,
}

const TopButtonsMobile = ({ hasImages }) => {
  const history = useAppHistory()
  const { locationId } = useSelector((state) => state.location)
  const isEmbed = useIsEmbed()
  const { setPaneDrawerToMiddlePosition, setPaneDrawerToLowPosition } =
    useLocationPane()
  const { id: recentChangesSectionId } = useSelector(
    (state) => state.activity.recentChanges.lastBrowsedSection,
  )
  const { userId: userActivityUserId } = useSelector(
    (state) => state.activity.userActivityLastBrowsedSection,
  )
  const { lastViewedListId } = useSelector((state) => state.save)
  const { lastViewedListPositionId } = useSelector((state) => state.list)
  const { handleClickDelete, isDeleteVisible, isDeleteDisabled } =
    useDeleteLocation()

  const backPath = lastViewedListId
    ? '/account/lists'
    : userActivityUserId
      ? `/users/${userActivityUserId}/activity`
      : recentChangesSectionId
        ? '/changes'
        : lastViewedListPositionId
          ? '/list'
          : '/map'

  const backGoesToMap = backPath === '/map'

  const handleBack = () => {
    if (backGoesToMap && !isEmbed) {
      setPaneDrawerToMiddlePosition()
    } else {
      history.push(`${backPath}?pane=&tab=`)
    }
  }

  return (
    <StyledButtons whiteBackground={!hasImages}>
      <RoundIconButton
        onClick={handleBack}
        icon={<ReturnIcon />}
        label="back-button"
      />
      <div>
        {!backGoesToMap && (
          <RoundIconButton
            onClick={(event) => {
              event.stopPropagation()
              if (isEmbed) {
                history.push('/map?pane=&tab=')
              } else {
                setPaneDrawerToLowPosition()
              }
            }}
            icon={<MapIcon />}
            label="map-button"
          />
        )}
        {isDeleteVisible && (
          <RoundIconButton
            onClick={(event) => {
              event.stopPropagation()
              handleClickDelete(locationId)
            }}
            icon={<TrashIcon />}
            label="delete-button"
            opaque={isDeleteDisabled}
          />
        )}
        <RoundIconButton
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
