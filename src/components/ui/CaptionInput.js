import { X as X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import CircleIcon from './CircleIcon'
import IconButton from './IconButton'
import Input from './Input'
import ListEntry from './ListEntry'

const StyledCaptionInput = styled(ListEntry)`
  padding: 8px;
  height: 33px;
  display: flex;
`

const CaptionInput = ({ value, onChange, onDelete, image }) => (
  <StyledCaptionInput
    leftIcons={<CircleIcon>{image}</CircleIcon>}
    primaryText={
      <Input placeholder="Add a caption..." onChange={onChange} value={value} />
    }
    rightIcons={
      <IconButton
        size="44"
        icon={<X />}
        onClick={onDelete}
        label="Delete image caption"
      />
    }
  />
)

export default CaptionInput
