import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import { useSelector } from 'react-redux'

import IconButton from '../ui/IconButton'

const FilterIconButton = (props) => {
  const {
    isLoading: isLoadingCounts,
    types,
    isDirty,
  } = useSelector((state) => state.filter)

  const { isLoading: isLoadingTypes, typesAccess } = useSelector(
    (state) => state.type,
  )

  const isInitialized = !typesAccess.isEmpty && types !== null
  const isLoaded = !isLoadingTypes && !isLoadingCounts

  let subscript
  if (isInitialized && isLoaded) {
    const numSelectedTypes = types.length
    const numAllTypes = typesAccess.selectableTypes().length
    if (numSelectedTypes !== numAllTypes) {
      if (numSelectedTypes >= 99) {
        subscript = '99+'
      } else {
        subscript = `${numSelectedTypes}`
      }
    } else {
      subscript = null
    }
  } else if (isInitialized && isDirty) {
    subscript = '...'
  } else {
    subscript = null
  }

  return (
    <IconButton
      size={45}
      icon={<FilterIcon />}
      subscript={subscript}
      label="filter-button"
      {...props}
    />
  )
}

export default FilterIconButton
