import { Link as LinkIcon } from '@styled-icons/boxicons-regular'

import IconButton from '../ui/IconButton'

const ShareIconButton = (props) => (
  <IconButton icon={<LinkIcon />} label="link-button" {...props} />
)

export default ShareIconButton
