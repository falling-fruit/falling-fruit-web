import { useFormikContext } from 'formik'
import { uniqBy } from 'lodash'
import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { openAddTypeModal } from '../../redux/typeSlice'
import { TypeName } from '../ui/TypeName'
import { AddTypeModal } from './AddTypeModal'
import { CreatableSelect } from './FormikWrappers'

const TypesSelect = () => {
  const { typesAccess } = useSelector((state) => state.type)
  const { values, validateForm, setFieldValue } = useFormikContext()
  const dispatch = useDispatch()

  const typeOptions = useMemo(() => typesAccess.asMenuEntries(), [typesAccess])
  const [newTypeInput, setNewTypeInput] = useState('')

  const handleNewType = useCallback(
    (newTypeOption) => {
      const updatedTypes = uniqBy(
        [...(values.types || []), newTypeOption],
        'value',
      )
      setFieldValue('types', updatedTypes)
      validateForm()
    },
    [values.types, setFieldValue, validateForm],
  )

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
      <AddTypeModal initialName={newTypeInput} onTypeAdded={handleNewType} />
    </>
  )
}

export default TypesSelect
