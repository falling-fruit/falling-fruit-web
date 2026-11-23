import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { deleteType, mergeType } from '../../utils/api'
import Button from '../ui/Button'
import TypePicker from './TypePicker'
import { typeStrings } from './typeStrings'
import { Section } from './typeStyles'
import { plainLabel } from './typeUtils'

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75em;
`

const MergePicker = styled.div`
  flex: 1;
  min-width: 14em;
  max-width: 28em;
`

const TypeActions = ({
  type,
  typeOptions,
  typeById,
  childrenMap,
  count,
  language,
  onStructureChange,
}) => {
  const [targetId, setTargetId] = useState(null)
  const [isBusy, setIsBusy] = useState(false)

  const childCount = (childrenMap.get(type.id) ?? []).length

  const excludedTargetIds = useMemo(() => new Set([type.id]), [type.id])

  const isUnused = count === 0 && childCount === 0

  const handleDelete = async () => {
    if (
      !isUnused &&
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
    if (!target) {
      return
    }
    if (
      !isUnused &&
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
      <ActionRow>
        <MergePicker>
          <TypePicker
            options={typeOptions}
            excludedIds={excludedTargetIds}
            value={targetId}
            language={language}
            onChange={setTargetId}
            placeholder={typeStrings.actions.mergeTarget}
            aria-label={typeStrings.actions.mergeTarget}
            disabled={isBusy}
          />
        </MergePicker>
        <Button onClick={handleMerge} disabled={targetId === null || isBusy}>
          {typeStrings.actions.mergeConfirmButton}
        </Button>
        <Button
          secondary
          onClick={handleDelete}
          disabled={count > 0 || isBusy}
          title={count > 0 ? typeStrings.actions.deleteBlocked : undefined}
        >
          {typeStrings.actions.delete}
        </Button>
      </ActionRow>
    </Section>
  )
}

export default TypeActions
