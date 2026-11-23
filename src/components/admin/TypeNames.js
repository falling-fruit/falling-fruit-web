import { Fragment, useState } from 'react'
import styled from 'styled-components/macro'

import { LANGUAGE_OPTIONS } from '../../i18n'
import SingleSelect from '../ui/SingleSelect'
import CommitInput from './CommitInput'
import { typeStrings } from './typeStrings'
import { FieldGrid, Muted, Section, SectionTitle } from './typeStyles'
import {
  ENGLISH_KEY,
  formatNames,
  hasRequiredName,
  languageLabel,
  orderedLanguageKeys,
  parseNames,
  SCIENTIFIC_KEY,
  withNames,
} from './typeUtils'

const NameError = styled.p`
  margin: 0.5em 0 0;
  color: ${({ theme }) => theme.red};
  font-size: 0.9rem;
`

const namesOf = (type, key) =>
  key === SCIENTIFIC_KEY ? type.scientific_names : type.common_names?.[key]

const TypeNames = ({ type, save, isSaving }) => {
  const [addedKeys, setAddedKeys] = useState([])
  const [blocked, setBlocked] = useState(false)

  const otherKeys = orderedLanguageKeys([
    ...Object.keys(type.common_names ?? {}),
    ...addedKeys,
  ]).filter((key) => key !== ENGLISH_KEY)

  const addOptions = LANGUAGE_OPTIONS.filter(
    (option) =>
      option.value !== ENGLISH_KEY && !otherKeys.includes(option.value),
  )

  const commit = (key) => (text) => {
    const changes = withNames(type, key, parseNames(text))
    if (!hasRequiredName({ ...type, ...changes })) {
      setBlocked(true)
      return Promise.resolve(false)
    }
    setBlocked(false)
    return save(changes)
  }

  const renderField = (key, label, focusOnMount = false) => (
    <Fragment key={key}>
      <label htmlFor={`type-names-${key}`}>{label}</label>
      <CommitInput
        id={`type-names-${key}`}
        value={formatNames(namesOf(type, key))}
        normalize={(text) => formatNames(parseNames(text))}
        onCommit={commit(key)}
        onFocus={() => setBlocked(false)}
        disabled={isSaving}
        focusOnMount={focusOnMount}
      />
    </Fragment>
  )

  return (
    <Section>
      <SectionTitle>{typeStrings.names.title}</SectionTitle>
      <Muted>{typeStrings.names.separatorHint}</Muted>
      <FieldGrid $columns="max-content 1fr">
        {renderField(SCIENTIFIC_KEY, typeStrings.names.scientific)}
        {renderField(ENGLISH_KEY, languageLabel(ENGLISH_KEY))}
        {otherKeys.map((key) =>
          renderField(key, languageLabel(key), addedKeys.includes(key)),
        )}
        {addOptions.length > 0 && (
          <>
            <label htmlFor="type-names-add">
              {typeStrings.names.addLanguage}
            </label>
            <SingleSelect
              id="type-names-add"
              options={addOptions}
              value={null}
              clearable
              disabled={isSaving}
              onChange={(option) =>
                option &&
                setAddedKeys((previous) => [...previous, option.value])
              }
            />
          </>
        )}
      </FieldGrid>
      {blocked && (
        <NameError role="alert">{typeStrings.names.lastNameBlocked}</NameError>
      )}
    </Section>
  )
}

export default TypeNames
