import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import { useContext } from 'react'

import SearchContext from '../search/SearchContext'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'

const FilterIconButton = ({ pressed, setPressed }) => {
  const { filters } = useContext(SearchContext)
  const typesLength = filters.types.length
  const filterCount = typesLength >= 99 ? '99+' : `${typesLength}`

  return (
    <IconButton
      size={45}
      raised={false}
      pressed={pressed}
      icon={<FilterIcon color={pressed ? theme.orange : theme.secondaryText} />}
      onClick={() => setPressed((pressed) => !pressed)}
      subscript={typesLength > 0 && filterCount}
      label="filter-button"
    />
  )
}

export default FilterIconButton
