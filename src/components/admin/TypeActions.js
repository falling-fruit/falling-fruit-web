import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { deleteType, mergeType } from '../../utils/api'
import Button from '../ui/Button'
import SingleSelect from '../ui/SingleSelect'
import { typeStrings } from './typeStrings'
import { Section } from './typeStyles'
import { compareTypeOptions, plainLabel, typeOption } from './typeUtils'

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75em;
`

const MergeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75em;
  margin-block-start: 1em;

  & > div:first-child {
    flex: 1;
    min-width: 14em;
    max-width: 28em;
  }
`

const TypeActions = ({
  type,
  types,
  typeById,
  childrenMap,
  count,
  language,
  onStructureChange,
}) => {
  const [isMerging, setIsMerging] = useState(false)
  const [targetId, setTargetId] = useState(null)
  const [isBusy, setIsBusy] = useState(false)

  const childCount = (childrenMap.get(type.id) ?? []).length

  const targetOptions = useMemo(
    () =>
      types
        .filter((candidate) => candidate.id !== type.id)
        .map((candidate) => typeOption(candidate, language))
        .sort(compareTypeOptions),
    [types, type.id, language],
  )

  const handleDelete = async () => {
    if (
      !window.confirm(
        typeStrings.actions.confirmDelete(
          plainLabel(type, language),
          childCount,
        ),
      )
    ) {
      return
    }
    setIsBusy(true)
    try {
      await deleteType(type.id)
      toast.success(typeStrings.actions.deleted)
      await onStructureChange(type.parent_id)
    } catch (error) {
      toast.error(typeStrings.actions.deleteFailed(error.message))
      setIsBusy(false)
    }
  }

  const handleMerge = async () => {
    const target = typeById.get(targetId)
    if (
      !target ||
      !window.confirm(
        typeStrings.actions.confirmMerge(
          plainLabel(type, language),
          plainLabel(target, language),
          count,
          childCount,
        ),
      )
    ) {
      return
    }
    setIsBusy(true)
    try {
      await mergeType(type.id, targetId)
      toast.success(typeStrings.actions.merged)
      await onStructureChange(targetId)
    } catch (error) {
      toast.error(typeStrings.actions.mergeFailed(error.message))
      setIsBusy(false)
    }
  }

  return (
    <Section>
      <ButtonRow>
        <Button
          secondary
          onClick={handleDelete}
          disabled={count > 0 || isBusy}
          title={count > 0 ? typeStrings.actions.deleteBlocked : undefined}
        >
          {typeStrings.actions.delete}
        </Button>
        {!isMerging && (
          <Button
            secondary
            onClick={() => setIsMerging(true)}
            disabled={isBusy}
          >
            {typeStrings.actions.merge}
          </Button>
        )}
      </ButtonRow>
      {isMerging && (
        <MergeRow>
          <SingleSelect
            options={targetOptions}
            value={targetId}
            onChange={(option) => setTargetId(option.value)}
            aria-label={typeStrings.actions.mergeTarget}
            disabled={isBusy}
          />
          <Button onClick={handleMerge} disabled={targetId === null || isBusy}>
            {typeStrings.actions.mergeConfirmButton}
          </Button>
          <Button
            secondary
            onClick={() => {
              setIsMerging(false)
              setTargetId(null)
            }}
            disabled={isBusy}
          >
            {typeStrings.actions.mergeCancel}
          </Button>
        </MergeRow>
      )}
    </Section>
  )
}

export default TypeActions
