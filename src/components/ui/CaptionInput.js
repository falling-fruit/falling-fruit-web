import styled from 'styled-components/macro'

import CircleIcon from './CircleIcon'
import IconButton from './IconButton'
import Input from './Input'
import ListEntry from './ListEntry'

const StyledCaptionInput = styled(ListEntry)`
  padding: 8px;
  height: 33px;
  display: flex;
  justify-content: space-between;
`

const CaptionInput = ({ value, onChange, onDelete, onClick, image }) => (
  <StyledCaptionInput
    leftIcons={<CircleIcon>{image}</CircleIcon>}
    primaryText={
      <Input placeholder="Add a caption..." onChange={onChange} value={value} />
    }
    rightIcons={
      <IconButton
        size="44"
        raised={false}
        icon={<> &times; </>}
        onClick={onClick}
        label="Delete image caption"
        pressed={onDelete}
      />
    }
  ></StyledCaptionInput>
)

export default CaptionInput
