import { useFormikContext } from 'formik'
import { uniqBy } from 'lodash'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { createFilter } from 'react-select'

import { openAddTypeModal } from '../../redux/typeSlice'
import { TOKEN_START } from '../../utils/localizedTypes'
import { TypeName } from '../ui/TypeName'
import { AddTypeModal } from './AddTypeModal'
import { CreatableSelect } from './FormikWrappers'

const baseFilter = createFilter()

export const matchFromTokenStart = (candidate, input) => {
  if (!input || candidate.data.__isNew__) {
    return true
  } else {
    return baseFilter(candidate, `${TOKEN_START}${input}`)
  }
}

const TypesSelect = () => {
  const { typesAccess } = useSelector((state) => state.type)
  const { values, validateForm, setFieldValue } = useFormikContext()
  const { t } = useTranslation()
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
        label={t('glossary.types')}
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
        onCreateOption={handleCreateOption}
        formatCreateLabel={(inputValue) => inputValue}
        filterOption={matchFromTokenStart}
      />
      <AddTypeModal initialName={newTypeInput} onTypeAdded={handleNewType} />
    </>
  )
}

export default TypesSelect
