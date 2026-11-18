import { useState } from 'react'
import styled from 'styled-components/macro'

import { LANGUAGE_OPTIONS } from '../../i18n'
import Button from '../ui/Button'
import { typeStrings } from './typeStrings'
import { Section, SectionTitle, Table } from './typeStyles'
import { AddRow, EditableRow } from './typeTableRows'
import {
  hasRequiredName,
  languageLabel,
  orderedLanguageKeys,
  SCIENTIFIC_KEY,
  withNames,
} from './typeUtils'

const AddButtonRow = styled.div`
  margin-block-start: 0.75em;
`

const TypeNamesTable = ({ type, save, isSaving }) => {
  const [adding, setAdding] = useState(null)

  const commonNames = type.common_names ?? {}
  const groups = [
    { key: SCIENTIFIC_KEY, names: type.scientific_names ?? [] },
    ...orderedLanguageKeys(Object.keys(commonNames)).map((key) => ({
      key,
      names: commonNames[key],
    })),
  ].filter((group) => group.names.length > 0)

  const usedKeys = new Set(groups.map((group) => group.key))
  const addOptions = [
    SCIENTIFIC_KEY,
    ...LANGUAGE_OPTIONS.map((o) => o.value),
  ].map((key) => ({
    value: key,
    label: languageLabel(key),
    isDisabled: usedKeys.has(key),
  }))
  const hasAvailableOption = addOptions.some((option) => !option.isDisabled)

  const namesAfterChange = (key, names) => ({
    ...type,
    ...withNames(type, key, names),
  })

  const rename = (key, names, index) => (newName) =>
    save(
      withNames(
        type,
        key,
        names.map((n, i) => (i === index ? newName : n)),
      ),
    )

  const remove = (key, names, index) => () => {
    const remaining = names.filter((_, i) => i !== index)
    if (window.confirm(typeStrings.names.confirmDelete(names[index]))) {
      save(withNames(type, key, remaining))
    }
  }

  const renderAddRow = (fixedKey) => (
    <AddRow
      key={`add-${fixedKey ?? 'language'}`}
      options={fixedKey === undefined ? addOptions : []}
      fixedKey={fixedKey}
      fixedLabel=""
      placeholder={typeStrings.names.namePlaceholder}
      isSaving={isSaving}
      onCancel={() => setAdding(null)}
      onAdd={async (key, name) => {
        const existing = groups.find((group) => group.key === key)?.names ?? []
        if (await save(withNames(type, key, [...existing, name]))) {
          setAdding(null)
        }
      }}
    />
  )

  return (
    <Section>
      <SectionTitle>{typeStrings.names.title}</SectionTitle>
      <Table>
        <thead>
          <tr>
            <th>{typeStrings.names.language}</th>
            <th>{typeStrings.names.name}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {groups.flatMap(({ key, names }) => [
            ...names.map((name, index) => (
              <EditableRow
                key={`${key}-${index}`}
                label={index === 0 ? languageLabel(key) : ''}
                value={name}
                isSaving={isSaving}
                canDelete={hasRequiredName(
                  namesAfterChange(
                    key,
                    names.filter((_, i) => i !== index),
                  ),
                )}
                onRename={rename(key, names, index)}
                onDelete={remove(key, names, index)}
                onAddSame={
                  index === names.length - 1 && adding?.key !== key
                    ? () => setAdding({ key })
                    : undefined
                }
              />
            )),
            ...(adding?.key === key ? [renderAddRow(key)] : []),
          ])}
          {adding && adding.key === undefined && renderAddRow(undefined)}
        </tbody>
      </Table>
      {!adding && hasAvailableOption && (
        <AddButtonRow>
          <Button secondary onClick={() => setAdding({})}>
            {typeStrings.names.add}
          </Button>
        </AddButtonRow>
      )}
    </Section>
  )
}

export default TypeNamesTable
