import { useState } from 'react'
import styled from 'styled-components/macro'

import Button from '../ui/Button'
import { LINK_LABELS, typeStrings, WRITABLE_LINK_CODES } from './typeStrings'
import { Muted, Section, SectionTitle, Table } from './typeStyles'
import { AddRow, EditableRow } from './typeTableRows'

const AddButtonRow = styled.div`
  margin-block-start: 0.75em;
`

const READ_ONLY_CODE = 'usda'

const renderUrl = (url) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    {url}
  </a>
)

const TypeLinksTable = ({ type, save, isSaving }) => {
  const [isAdding, setIsAdding] = useState(false)

  const urls = type.urls ?? {}
  const entries = Object.entries(urls)
  const writableUrls = Object.fromEntries(
    entries.filter(([code]) => code !== READ_ONLY_CODE),
  )
  const addOptions = WRITABLE_LINK_CODES.filter((code) => !urls[code]).map(
    (code) => ({ value: code, label: LINK_LABELS[code] }),
  )

  const label = (code) => LINK_LABELS[code] ?? code

  const setUrl = (code, url) => save({ urls: { ...writableUrls, [code]: url } })

  const removeUrl = (code) => () => {
    if (window.confirm(typeStrings.links.confirmDelete(label(code)))) {
      const { [code]: _removed, ...remaining } = writableUrls
      save({ urls: remaining })
    }
  }

  return (
    <Section>
      <SectionTitle>{typeStrings.links.title}</SectionTitle>
      {entries.length === 0 && !isAdding ? (
        <Muted>{typeStrings.links.none}</Muted>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>{typeStrings.links.resource}</th>
              <th>{typeStrings.links.url}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {entries.map(([code, url]) => (
              <EditableRow
                key={code}
                label={label(code)}
                value={url}
                isReadOnly={code === READ_ONLY_CODE}
                isSaving={isSaving}
                renderValue={renderUrl}
                onRename={(newUrl) => setUrl(code, newUrl)}
                onDelete={removeUrl(code)}
              />
            ))}
            {isAdding && (
              <AddRow
                options={addOptions}
                placeholder={typeStrings.links.urlPlaceholder}
                isSaving={isSaving}
                onCancel={() => setIsAdding(false)}
                onAdd={async (code, url) => {
                  if (await setUrl(code, url)) {
                    setIsAdding(false)
                  }
                }}
              />
            )}
          </tbody>
        </Table>
      )}
      {!isAdding && addOptions.length > 0 && (
        <AddButtonRow>
          <Button secondary onClick={() => setIsAdding(true)}>
            {typeStrings.links.add}
          </Button>
        </AddButtonRow>
      )}
    </Section>
  )
}

export default TypeLinksTable
