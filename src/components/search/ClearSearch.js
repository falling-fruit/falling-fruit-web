import { Clear as ClearIcon } from '@styled-icons/material/Clear'

import ResetButton from '../ui/ResetButton'

const ClearSearchButton = (props) => (
  <ResetButton label="clear-button" {...props}>
    <ClearIcon height={10} />
  </ResetButton>
)

export default ClearSearchButton
