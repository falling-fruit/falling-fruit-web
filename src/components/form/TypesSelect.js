import { useFormikContext } from 'formik'
import { uniqBy } from 'lodash'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { openAddTypeModal } from '../../redux/typeSlice'
import { tokenizeQuery } from '../../utils/tokenize'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { TypeName } from '../ui/TypeName'
import { AddTypeModal } from './AddTypeModal'
import { CreatableSelect } from './FormikWrappers'

export const matchFromTokenStart = (candidate, input) => {
  if (!input || candidate.data.__isNew__) {
    return true
  } else {
    return candidate.data.searchReference.indexOf(tokenizeQuery(input)) > -1
  }
}

const TypesSelect = () => {
  const { typesAccess } = useSelector((state) => state.type)
  const { values, validateForm, setFieldValue } = useFormikContext()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()

  const typeOptions = useMemo(() => typesAccess.asMenuEntries(), [typesAccess])
  const menuMaxHeight = isDesktop
    ? `max(300px, calc(100vh - ${305 + (values.types?.length > 0 ? values.types.length * 30 : 0)}px))`
    : '300px'
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
        label={t('glossary.type.other')}
        options={typeOptions}
        isMulti
        closeMenuOnSelect
        blurInputOnSelect={false}
        formatOptionLabel={(option) =>
          option.__isNew__ ? (
            <div>
              <b>{t('new_type.add_type_label')} </b>
              {option.label}
            </div>
          ) : (
            <TypeName {...option} />
          )
        }
        isVirtualized
        required
        hideSelectedOptions={false}
        onCreateOption={handleCreateOption}
        formatCreateLabel={(inputValue) => inputValue}
        filterOption={matchFromTokenStart}
        menuMaxHeight={menuMaxHeight}
      />
      <AddTypeModal initialName={newTypeInput} onTypeAdded={handleNewType} />
    </>
  )
}

export default TypesSelect
