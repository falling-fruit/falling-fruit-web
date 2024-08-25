import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import { useSelector } from 'react-redux'

import IconButton from '../ui/IconButton'

const FilterIconButton = (props) => {
  const { types, muni, invasive } = useSelector((state) => state.filter)

  const { typesAccess } = useSelector((state) => state.type)

  const isInitialized = !typesAccess.isEmpty && types !== null
  const isDefaultChoice =
    types?.length === typesAccess.selectableTypes().length &&
    muni === true &&
    invasive === false

  return (
    <IconButton
      size={45}
      icon={<FilterIcon />}
      subscript={isInitialized && !isDefaultChoice ? ' ' : null}
      subscriptSize={16}
      label="filter-button"
      {...props}
    />
  )
}

export default FilterIconButton
