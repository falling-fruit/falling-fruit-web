import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'

import { useSearch } from '../../contexts/SearchContext'
import IconButton from '../ui/IconButton'

const FilterIconButton = ({ pressed, setPressed }) => {
  const { filters } = useSearch()
  const typesLength = filters.types.length
  const filterCount = typesLength >= 99 ? '99+' : `${typesLength}`

  return (
    <IconButton
      size={45}
      pressed={pressed}
      icon={<FilterIcon />}
      onClick={() => setPressed((pressed) => !pressed)}
      subscript={typesLength > 0 && filterCount}
      label="filter-button"
    />
  )
}

export default FilterIconButton
