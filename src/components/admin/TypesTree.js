import { ChevronDown, ChevronRight } from '@styled-icons/boxicons-regular'
import { memo, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'
import TypeLabel from './TypeLabel'
import { typeStrings } from './typeStrings'
import { useStableCallback } from './useStableCallback'
import VirtualList from './VirtualList'

const ROOT_DROP = 'root'
const ROW_HEIGHT = 28
const INDENT_EM = 1.25

const Root = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  outline: ${({ $dropTarget, theme }) =>
    $dropTarget ? `2px dashed ${theme.orange}` : 'none'};
  outline-offset: -2px;
`

const DetachZone = styled.div`
  flex: 0 0 auto;
  padding: 0.75em;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.secondaryText};
  border: 2px dashed
    ${({ $dropTarget, theme }) =>
      $dropTarget ? theme.orange : theme.secondaryBackground};
  background: ${({ $dropTarget, theme }) =>
    $dropTarget ? theme.transparentOrange : theme.background};
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25em;
  height: 100%;
  box-sizing: border-box;
  padding-inline-end: 0.5em;
  white-space: nowrap;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
  background: ${({ $selected, $dropTarget, theme }) =>
    $selected || $dropTarget ? theme.transparentOrange : 'transparent'};
  outline: ${({ $dropTarget, theme }) =>
    $dropTarget ? `2px solid ${theme.orange}` : 'none'};
  outline-offset: -2px;
  opacity: ${({ $faded }) => ($faded ? 0.4 : 1)};

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? theme.transparentOrange : theme.navBackground};
  }
`

const Marker = styled.span`
  flex: 0 0 1.1em;
  text-align: center;
  font-weight: bold;
  color: ${({ $error, theme }) => ($error ? theme.red : theme.orange)};
`

const Indent = styled.span`
  flex: 0 0 auto;
  display: inline-block;
`

const Toggle = styled(ResetButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25em;
  height: 1.25em;
  flex-shrink: 0;
  color: ${({ theme }) => theme.secondaryText};
`

const Spacer = styled.span`
  display: inline-block;
  width: 1.25em;
  flex-shrink: 0;
`

const Count = styled.span`
  margin-inline-start: 0.25em;
  font-weight: bold;
  color: ${({ theme, $zero }) => ($zero ? theme.tertiaryText : theme.text)};
  font-variant-numeric: tabular-nums;
`

const TypeRow = memo(
  ({
    type,
    level,
    hasChildren,
    isExpanded,
    isSelected,
    isFaded,
    isDropTarget,
    hasError,
    count,
    language,
    onToggle,
    onSelect,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
  }) => (
    <Row
      role="treeitem"
      aria-level={level + 1}
      aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined}
      $selected={isSelected}
      $dropTarget={isDropTarget}
      $faded={isFaded}
      onClick={(event) => onSelect(type.id, event)}
      draggable
      onDragStart={(event) => onDragStart(event, type.id)}
      onDragEnd={onDragEnd}
      onDragOver={(event) => onDragOver(event, type.id)}
      onDrop={(event) => onDrop(event, type.id)}
    >
      <Marker title={typeStrings.tree.pendingTitle}>
        {type.pending && typeStrings.tree.pendingMarker}
      </Marker>
      <Marker $error title={typeStrings.tree.errorTitle}>
        {hasError && typeStrings.tree.errorMarker}
      </Marker>
      <Indent style={{ width: `${level * INDENT_EM}em` }} />
      {hasChildren ? (
        <Toggle
          onClick={(event) => {
            event.stopPropagation()
            onToggle(type.id)
          }}
          aria-label={
            isExpanded ? typeStrings.tree.collapse : typeStrings.tree.expand
          }
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </Toggle>
      ) : (
        <Spacer />
      )}
      <TypeLabel type={type} language={language} />
      <Count $zero={count === 0}>{count.toLocaleString()}</Count>
    </Row>
  ),
)

TypeRow.displayName = 'TypeRow'

const TypesTree = ({
  rows,
  indexById,
  selectedId,
  selectedIds,
  counts,
  errors,
  language,
  onToggle,
  onSelect,
  canMove,
  onMove,
}) => {
  const [drag, setDrag] = useState(null)
  const [overId, setOverId] = useState(null)
  const listRef = useRef(null)
  const scrolledFor = useRef(null)

  const selectedIndex = indexById.get(selectedId)
  useEffect(() => {
    if (selectedIndex !== undefined && scrolledFor.current !== selectedId) {
      scrolledFor.current = selectedId
      listRef.current?.scrollToIndex(selectedIndex)
    }
  }, [selectedId, selectedIndex])

  const stableCanMove = useStableCallback(canMove)
  const stableOnMove = useStableCallback(onMove)
  const stableOnSelect = useStableCallback(onSelect)
  const stableOnToggle = useStableCallback(onToggle)
  const stableSelectedIds = useStableCallback(() => selectedIds)
  const stableRows = useStableCallback(() => rows)

  const dropCache = useRef({ drag: null, results: new Map() })
  if (dropCache.current.drag !== drag) {
    dropCache.current = { drag, results: new Map() }
  }

  const canDrop = (parentId) => {
    if (drag === null) {
      return false
    }
    const key = parentId ?? ROOT_DROP
    const { results } = dropCache.current
    if (!results.has(key)) {
      results.set(
        key,
        drag.ids.some((id) => stableCanMove(id, parentId)),
      )
    }
    return results.get(key)
  }

  const endDrag = useStableCallback(() => {
    setDrag(null)
    setOverId(null)
  })

  const handleRowSelect = useStableCallback((id, event) =>
    stableOnSelect(
      id,
      event,
      stableRows().map((row) => row.type.id),
    ),
  )

  const handleDragStart = useStableCallback((event, id) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(id))
    const selected = stableSelectedIds()
    setDrag({ ids: selected.has(id) ? [...selected] : [id], sourceId: id })
  })

  const handleDragOver = (event, parentId) => {
    if (drag === null) {
      return
    }
    event.stopPropagation()
    if (canDrop(parentId)) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      setOverId(parentId ?? ROOT_DROP)
    } else {
      setOverId(null)
    }
  }

  const handleDrop = (event, parentId) => {
    if (drag === null) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const movedIds = drag.ids
    const allowed = canDrop(parentId)
    endDrag()
    if (allowed) {
      stableOnMove(movedIds, parentId)
    }
  }

  const stableDragOver = useStableCallback(handleDragOver)
  const stableDrop = useStableCallback(handleDrop)

  const sourceIndex = drag ? indexById.get(drag.sourceId) : undefined

  return (
    <Root
      role="tree"
      aria-label={typeStrings.tree.ariaLabel}
      $dropTarget={overId === ROOT_DROP}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOverId(null)
        }
      }}
      onDragOver={(event) => handleDragOver(event, null)}
      onDrop={(event) => handleDrop(event, null)}
    >
      <VirtualList
        ref={listRef}
        itemCount={rows.length}
        itemHeight={ROW_HEIGHT}
        alwaysRenderIndices={sourceIndex === undefined ? [] : [sourceIndex]}
        getItemKey={(index) => rows[index].type.id}
        renderItem={(index) => {
          const { type, level, hasChildren, isExpanded, isMatch } = rows[index]
          return (
            <TypeRow
              type={type}
              level={level}
              hasChildren={hasChildren}
              isExpanded={isExpanded}
              isSelected={type.id === selectedId || selectedIds.has(type.id)}
              isFaded={drag !== null ? !canDrop(type.id) : !isMatch}
              isDropTarget={overId === type.id}
              hasError={errors.has(type.id)}
              count={counts.get(type.id) ?? 0}
              language={language}
              onToggle={stableOnToggle}
              onSelect={handleRowSelect}
              onDragStart={handleDragStart}
              onDragEnd={endDrag}
              onDragOver={stableDragOver}
              onDrop={stableDrop}
            />
          )
        }}
      />
      {drag !== null && (
        <DetachZone $dropTarget={overId === ROOT_DROP}>
          {canDrop(null)
            ? typeStrings.tree.detachHere
            : typeStrings.tree.alreadyTopLevel}
        </DetachZone>
      )}
    </Root>
  )
}

export default TypesTree
