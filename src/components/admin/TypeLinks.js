import { Fragment, useState } from 'react'

import SingleSelect from '../ui/SingleSelect'
import CommitInput from './CommitInput'
import { LINK_LABELS, typeStrings, WRITABLE_LINK_CODES } from './typeStrings'
import { FieldGrid, Section, SectionTitle } from './typeStyles'

const READ_ONLY_CODE = 'usda'
const ALWAYS_SHOWN_CODE = 'wikipedia'

const label = (code) => LINK_LABELS[code] ?? code

const TypeLinks = ({ type, save, isSaving }) => {
  const [addedCodes, setAddedCodes] = useState([])

  const urls = type.urls ?? {}
  const writableUrls = Object.fromEntries(
    Object.entries(urls).filter(([code]) => code !== READ_ONLY_CODE),
  )
  const shownCodes = WRITABLE_LINK_CODES.filter(
    (code) =>
      code === ALWAYS_SHOWN_CODE || urls[code] || addedCodes.includes(code),
  )
  const addOptions = WRITABLE_LINK_CODES.filter(
    (code) => !shownCodes.includes(code),
  ).map((code) => ({ value: code, label: label(code) }))

  const setUrl = (code) => (url) => {
    const { [code]: _removed, ...remaining } = writableUrls
    return save({ urls: url ? { ...remaining, [code]: url } : remaining })
  }

  return (
    <Section>
      <SectionTitle>{typeStrings.links.title}</SectionTitle>
      <FieldGrid $columns="max-content 1fr">
        {shownCodes.map((code) => (
          <Fragment key={code}>
            <label htmlFor={`type-link-${code}`}>{label(code)}</label>
            <CommitInput
              id={`type-link-${code}`}
              value={urls[code] ?? ''}
              onCommit={setUrl(code)}
              disabled={isSaving}
              placeholder={typeStrings.links.urlPlaceholder}
              focusOnMount={addedCodes.includes(code)}
            />
          </Fragment>
        ))}
        {urls[READ_ONLY_CODE] && (
          <>
            <span>{label(READ_ONLY_CODE)}</span>
            <a
              href={urls[READ_ONLY_CODE]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {urls[READ_ONLY_CODE]}
            </a>
          </>
        )}
        {addOptions.length > 0 && (
          <>
            <label htmlFor="type-link-add">{typeStrings.links.add}</label>
            <SingleSelect
              id="type-link-add"
              options={addOptions}
              value={null}
              clearable
              disabled={isSaving}
              onChange={(option) =>
                option &&
                setAddedCodes((previous) => [...previous, option.value])
              }
            />
          </>
        )}
      </FieldGrid>
    </Section>
  )
}

export default TypeLinks
