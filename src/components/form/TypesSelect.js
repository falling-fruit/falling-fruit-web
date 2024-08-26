import { useFormikContext } from 'formik'
import { uniqBy } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { openAddTypeModal } from '../../redux/typeSlice'
import { TypeName } from '../ui/TypeName'
import { AddTypeModal } from './AddTypeModal'
import { CreatableSelect } from './FormikWrappers'

const TypesSelect = () => {
  const { typesAccess, recentlyAddedTypesByLocation } = useSelector(
    (state) => state.type,
  )
  const { locationId } = useSelector((state) => state.location)
  const { values, setFieldValue } = useFormikContext()
  const dispatch = useDispatch()

  const typeOptions = useMemo(() => typesAccess.asMenuEntries(), [typesAccess])

  const [newTypeInput, setNewTypeInput] = useState('')

  const recentlyAddedTypes = useMemo(
    () =>
      (recentlyAddedTypesByLocation[locationId] || [])
        .map((typeId) => typesAccess.getMenuEntry(typeId))
        .filter(Boolean),
    [recentlyAddedTypesByLocation, locationId, typesAccess],
  )

  useEffect(() => {
    if (recentlyAddedTypes.length > 0) {
      const updatedTypes = uniqBy(
        [...(values.types || []), ...recentlyAddedTypes],
        'value',
      )
      setFieldValue('types', updatedTypes)
    }
  }, [recentlyAddedTypes.join(', ')]) //eslint-disable-line

  const handleCreateOption = useCallback(
    (inputValue) => {
      setNewTypeInput(inputValue)
      dispatch(openAddTypeModal())
    },
    [dispatch],
  )

  return (
    <>
      <CreatableSelect
        name="types"
        label="Types"
        options={typeOptions}
        isMulti
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        formatOptionLabel={(option) =>
          option.__isNew__ ? (
            <div>
              <b> Add Type: </b>
              {option.label}
            </div>
          ) : (
            <TypeName {...option} />
          )
        }
        isVirtualized
        required
        invalidWhenUntouched
        onCreateOption={handleCreateOption}
        formatCreateLabel={(inputValue) => inputValue}
      />
      <AddTypeModal initialName={newTypeInput} />
    </>
  )
}

export default TypesSelect
