import { Plus } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import IconButton from './IconButton'

const AddLocationButton = styled(IconButton).attrs((props) => ({
  label: 'Add entry',
  size: 68,
  icon: <Plus />,
  raised: true,
  ...props,
}))`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1;
`

export default AddLocationButton
