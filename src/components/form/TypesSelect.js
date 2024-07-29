import { sortBy } from 'lodash'
import { useMemo } from 'react'

import { useTypesById } from '../../redux/useTypesById'
import { TypeName } from '../ui/TypeName'
import { Select } from './FormikWrappers'

const customFilterOption = (option, inputValue) => {
  const { data } = option
  const { scientificName, label } = data
  const lowerInput = inputValue.toLowerCase()

  // First priority: prefix match on scientific name
  if (scientificName.toLowerCase().startsWith(lowerInput)) {
    return true
  }

  // Second priority: prefix match on label
  if (label.toLowerCase().startsWith(lowerInput)) {
    return true
  }

  // Third priority: includes match on either scientific name or label
  return (
    scientificName.toLowerCase().includes(lowerInput) ||
    label.toLowerCase().includes(lowerInput)
  )
}

const TypesSelect = () => {
  const { typesById } = useTypesById()

  const typeOptions = useMemo(() => {
    if (!typesById) {
      return []
    }

    const options = Object.values(typesById).map(
      ({ id, common_names, scientific_names, taxonomic_rank }) => ({
        value: id,
        label: `${scientific_names?.[0] ?? ''} (${common_names.en?.[0] ?? ''})`,
        scientificName: scientific_names?.[0] ?? '',
        taxonomicRank: taxonomic_rank ?? 0,
      }),
    )

    return sortBy(options, [
      (o) => !o.scientificName,
      'scientificName',
      (o) => -o.taxonomicRank,
    ])
  }, [typesById])

  return (
    <Select
      name="types"
      label="Types"
      options={typeOptions}
      isMulti
      closeMenuOnSelect={false}
      blurInputOnSelect={false}
      formatOptionLabel={(option) => <TypeName typeId={option.value} />}
      isVirtualized
      required
      invalidWhenUntouched
      filterOption={customFilterOption}
    />
  )
}

export default TypesSelect
