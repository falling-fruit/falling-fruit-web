import { X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import CircleIcon from './CircleIcon'
import IconButton from './IconButton'
import Input from './Input'
import ListEntry from './ListEntry'

const StyledCaptionInput = styled(ListEntry)`
  height: 36px;
  margin-bottom: 16px;
  border-bottom: 0px !important;

  div:first-child {
    margin-right: 2px;
  }

  div:last-child {
    margin-left: 2px;

    svg {
      height: 62%;
    }
  }
`

const StyledInput = styled(Input)`
  font-size: 16px;
  height: 36px;
`

const CaptionInput = ({ value, onChange, onDelete, image }) => (
  <StyledCaptionInput
    leftIcons={<CircleIcon size="36">{image}</CircleIcon>}
    primaryText={
      <StyledInput
        placeholder="Add a caption..."
        onChange={onChange}
        value={value}
      />
    }
    rightIcons={
      <IconButton
        size="36"
        icon={<X />}
        onClick={onDelete}
        label="Delete image caption"
      />
    }
  />
)

export default CaptionInput
