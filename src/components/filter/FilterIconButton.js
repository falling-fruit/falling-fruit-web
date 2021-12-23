import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import { useSelector } from 'react-redux'

import IconButton from '../ui/IconButton'

const FilterIconButton = (props) => {
  const typesLength = useSelector((state) => state.filter.types?.length)
  const filterCount =
    typesLength === null || typesLength >= 99 ? '99+' : `${typesLength}`

  return (
    <IconButton
      size={45}
      icon={<FilterIcon />}
      subscript={typesLength > 0 && filterCount}
      label="filter-button"
      {...props}
    />
  )
}

export default FilterIconButton
