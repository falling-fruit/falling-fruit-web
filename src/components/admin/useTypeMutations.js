import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { addType, editType } from '../../utils/api'
import { typeStrings } from './typeStrings'
import { descendantIds, MAX_PARENT_RANK } from './typeUtils'

export const useTypeMutations = ({
  typeById,
  childrenMap,
  onTypeUpdated,
  onTypeAdded,
}) => {
  const canMove = useCallback(
    (typeId, parentId) => {
      const moved = typeById.get(typeId)
      if (!moved || parentId === (moved.parent_id ?? null)) {
        return false
      }
      if (parentId === null) {
        return true
      }
      const target = typeById.get(parentId)
      return (
        Boolean(target) &&
        parentId !== typeId &&
        !descendantIds(typeId, childrenMap).has(parentId) &&
        (target.taxonomic_rank ?? 0) <= MAX_PARENT_RANK
      )
    },
    [typeById, childrenMap],
  )

  const applyParent = useCallback(
    async (typeId, parentId) => {
      try {
        const updated = await editType(typeId, { parent_id: parentId })
        onTypeUpdated(updated)
        return true
      } catch (error) {
        toast.error(typeStrings.details.saveFailed(error.message))
        return false
      }
    },
    [onTypeUpdated],
  )

  const moveTypes = useCallback(
    async (typeIds, parentId) => {
      const moves = []
      for (const typeId of typeIds.filter((id) => canMove(id, parentId))) {
        const previousParentId = typeById.get(typeId).parent_id ?? null
        if (await applyParent(typeId, parentId)) {
          moves.push({ typeId, previousParentId })
        }
      }
      return moves
    },
    [canMove, applyParent, typeById],
  )

  const undoMoves = useCallback(
    async (moves) => {
      const remaining = []
      for (const move of moves) {
        if (!(await applyParent(move.typeId, move.previousParentId))) {
          remaining.push(move)
        }
      }
      return remaining
    },
    [applyParent],
  )

  const createType = useCallback(
    async (data, childIds) => {
      let created
      try {
        created = await addType(data)
      } catch (error) {
        toast.error(typeStrings.create.failed(error.message))
        return null
      }
      onTypeAdded(created)
      let movedCount = 0
      for (const childId of childIds) {
        if (await applyParent(childId, created.id)) {
          movedCount += 1
        }
      }
      return { created, movedCount }
    },
    [onTypeAdded, applyParent],
  )

  return { canMove, applyParent, moveTypes, undoMoves, createType }
}
