import { Clear as ClearIcon } from '@styled-icons/material/Clear'

import ResetButton from '../ui/ResetButton'

const ClearSearchButton = (props) => (
  <ResetButton {...props}>
    <ClearIcon fontSize="small" />
  </ResetButton>
)

export default ClearSearchButton
