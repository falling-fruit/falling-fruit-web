import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { TypeName } from '../ui/TypeName'
import { Select } from './FormikWrappers'

const TypesSelect = () => {
  const { typesAccess } = useSelector((state) => state.type)

  const typeOptions = useMemo(() => {
    const options = typesAccess.localizedTypes.map(
      ({ id, commonName, scientificName, taxonomicRank }) => ({
        value: id,
        label: `${scientificName} (${commonName})`,
        commonName,
        scientificName,
        taxonomicRank,
      }),
    )

    return options
  }, [typesAccess])

  const handleCreateOption = (inputValue) => {
    // Handle the creation of a new option
    const newOption = {
      id: inputValue,
      value: inputValue,
      label: inputValue,
      commonName: inputValue,
      scientificName: inputValue,
      taxonomicRank: 'custom',
    }
    console.log(inputValue)
    // You might want to dispatch an action here to add the new option to your state
    return newOption
  }

  return (
    <Select
      name="types"
      label="Types"
      options={typeOptions}
      isMulti
      closeMenuOnSelect={false}
      blurInputOnSelect={false}
      formatOptionLabel={(option) => (
        <TypeName
          commonName={option.commonName}
          scientificName={option.scientificName}
        />
      )}
      isVirtualized
      required
      invalidWhenUntouched
      onCreateOption={handleCreateOption}
    />
  )
}

export default TypesSelect
