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
    />
  )
}

export default TypesSelect
