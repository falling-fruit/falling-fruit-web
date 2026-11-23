import { useMemo, useState } from 'react'
import styled from 'styled-components/macro'

import Button from '../ui/Button'
import TypeLabel from './TypeLabel'
import TypePicker from './TypePicker'
import { typeStrings } from './typeStrings'
import { FieldGrid, Section, SectionTitle } from './typeStyles'
import { descendantIds } from './typeUtils'

const Title = styled.h2`
  margin-block: 0 0.75em;
  font-size: 1.5rem !important;
`

const SelectedList = styled.ul`
  max-height: 14em;
  margin: 0;
  padding-inline-start: 1.5em;
  overflow-y: auto;
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75em;
  align-items: center;
`

const MultiTypePanel = ({
  selectedIds,
  typeOptions,
  typeById,
  childrenMap,
  language,
  onUnpend,
  onAssignParent,
  onCreateParent,
  onClear,
}) => {
  const [parentId, setParentId] = useState(null)
  const [isBusy, setIsBusy] = useState(false)

  const ids = useMemo(() => [...selectedIds], [selectedIds])
  const pendingIds = useMemo(
    () => ids.filter((id) => typeById.get(id)?.pending),
    [ids, typeById],
  )
  const excludedParentIds = useMemo(() => {
    const excluded = new Set(ids)
    ids.forEach((id) =>
      descendantIds(id, childrenMap).forEach((descendant) =>
        excluded.add(descendant),
      ),
    )
    return excluded
  }, [ids, childrenMap])

  const run = async (action) => {
    setIsBusy(true)
    try {
      await action()
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div>
      <Title>{typeStrings.multi.title(ids.length)}</Title>
      <Section>
        <SelectedList>
          {ids.map((id) => {
            const type = typeById.get(id)
            return (
              type && (
                <li key={id}>
                  <TypeLabel type={type} language={language} showId />
                </li>
              )
            )
          })}
        </SelectedList>
      </Section>
      <Section>
        <SectionTitle>{typeStrings.multi.pendingTitle}</SectionTitle>
        <ButtonRow>
          <Button
            disabled={isBusy || pendingIds.length === 0}
            onClick={() => run(() => onUnpend(pendingIds))}
          >
            {typeStrings.multi.unpend(pendingIds.length)}
          </Button>
        </ButtonRow>
      </Section>
      <Section>
        <SectionTitle>
          <label htmlFor="type-multi-parent">
            {typeStrings.multi.assignParent}
          </label>
        </SectionTitle>
        <FieldGrid $columns="minmax(14em, 28em) max-content">
          <TypePicker
            inputId="type-multi-parent"
            options={typeOptions}
            excludedIds={excludedParentIds}
            value={parentId}
            language={language}
            clearable
            disabled={isBusy}
            onChange={setParentId}
          />
          <Button
            disabled={isBusy || parentId === null}
            onClick={() =>
              run(async () => {
                await onAssignParent(ids, parentId)
                setParentId(null)
              })
            }
          >
            {typeStrings.multi.apply}
          </Button>
        </FieldGrid>
      </Section>
      <Section>
        <ButtonRow>
          <Button
            secondary
            disabled={isBusy}
            onClick={() => onCreateParent(ids)}
          >
            {typeStrings.create.createParent}
          </Button>
          <Button secondary disabled={isBusy} onClick={onClear}>
            {typeStrings.multi.clear}
          </Button>
        </ButtonRow>
      </Section>
    </div>
  )
}

export default MultiTypePanel
