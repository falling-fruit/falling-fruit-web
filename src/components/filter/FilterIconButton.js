import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import { useSelector } from 'react-redux'

import IconButton from '../ui/IconButton'

const FilterIconButton = (props) => {
  const { types, muni } = useSelector((state) => state.filter)

  const { typesAccess } = useSelector((state) => state.type)

  const isInitialized = !typesAccess.isEmpty && types !== null

  const defaultSelectionSet = new Set(
    typesAccess
      .selectableTypesWithCategories('forager', 'freegan')
      .map((t) => t.id),
  )

  const currentSelectionSet = new Set(types)

  const isDefaultChoice =
    defaultSelectionSet.size === currentSelectionSet.size &&
    [...defaultSelectionSet].every((id) => currentSelectionSet.has(id)) &&
    muni === true

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
