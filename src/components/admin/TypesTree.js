import { ChevronDown, ChevronRight } from '@styled-icons/boxicons-regular'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'
import { ScientificName } from '../ui/TypeName'
import { typeStrings } from './typeStrings'
import { labelParts } from './typeUtils'

const ROOT_DROP = 'root'

const Root = styled.div`
  min-height: 12em;
  box-sizing: border-box;
  outline: ${({ $dropTarget, theme }) =>
    $dropTarget ? `2px dashed ${theme.orange}` : 'none'};
  outline-offset: -2px;
`

const DetachZone = styled.div`
  position: sticky;
  bottom: 0;
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

const TreeList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

const Row = styled.li`
  display: flex;
  align-items: center;
  gap: 0.25em;
  padding-block: 0.2em;
  padding-inline-end: 0.5em;
  padding-inline-start: ${({ $level }) => $level * 1.25}em;
  white-space: nowrap;
  font-size: 0.875rem;
  cursor: pointer;
  background: ${({ $selected, $dropTarget, theme }) =>
    $selected || $dropTarget ? theme.transparentOrange : 'transparent'};
  outline: ${({ $dropTarget, theme }) =>
    $dropTarget ? `2px solid ${theme.orange}` : 'none'};
  outline-offset: -2px;
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? theme.transparentOrange : theme.navBackground};
  }
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

const Common = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.secondaryText};
`

const Latin = styled(ScientificName)`
  color: ${({ theme }) => theme.text};
`

const Count = styled.span`
  font-weight: bold;
  color: ${({ theme, $zero }) => ($zero ? theme.tertiaryText : theme.text)};
  font-variant-numeric: tabular-nums;
`

const Pending = styled.span`
  color: ${({ theme }) => theme.orange};
  font-weight: bold;
`

const ErrorMarker = styled.span`
  color: ${({ theme }) => theme.red};
  font-weight: bold;
`

const TypesTree = ({
  nodes,
  expanded,
  selectedId,
  counts,
  errors,
  language,
  onToggle,
  onSelect,
  canMove,
  onMove,
}) => {
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)

  useEffect(() => {
    if (selectedId) {
      document
        .getElementById(`type-node-${selectedId}`)
        ?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedId])

  const endDrag = () => {
    setDragId(null)
    setOverId(null)
  }

  const dropHandlers = (parentId) => ({
    onDragOver: (event) => {
      if (dragId === null) {
        return
      }
      event.stopPropagation()
      if (canMove(dragId, parentId)) {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        setOverId(parentId ?? ROOT_DROP)
      } else {
        setOverId(null)
      }
    },
    onDrop: (event) => {
      if (dragId === null) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      if (canMove(dragId, parentId)) {
        const movedId = dragId
        endDrag()
        onMove(movedId, parentId)
      } else {
        endDrag()
      }
    },
  })

  const renderNode = (node, level) => {
    const { type } = node
    const hasChildren = node.children.length > 0
    const isExpanded = expanded.has(type.id)
    const { common, botanical, cultivar } = labelParts(type, language)
    const count = counts.get(type.id) ?? 0

    return (
      <React.Fragment key={type.id}>
        <Row
          id={`type-node-${type.id}`}
          $level={level}
          $selected={type.id === selectedId}
          $dropTarget={overId === type.id}
          $disabled={dragId !== null && !canMove(dragId, type.id)}
          onClick={() => onSelect(type.id)}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('text/plain', String(type.id))
            setDragId(type.id)
          }}
          onDragEnd={endDrag}
          {...dropHandlers(type.id)}
        >
          {hasChildren ? (
            <Toggle
              onClick={(event) => {
                event.stopPropagation()
                onToggle(type.id)
              }}
              aria-label={
                isExpanded ? typeStrings.tree.collapse : typeStrings.tree.expand
              }
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </Toggle>
          ) : (
            <Spacer />
          )}
          {common && <Common>{common}</Common>}
          {(botanical || cultivar) && (
            <Latin botanical={botanical} cultivar={cultivar} />
          )}
          <Count $zero={count === 0}>{count.toLocaleString()}</Count>
          {errors.has(type.id) && (
            <ErrorMarker title={typeStrings.tree.errorTitle}>
              {typeStrings.tree.errorMarker}
            </ErrorMarker>
          )}
          {type.pending && (
            <Pending title={typeStrings.tree.pendingTitle}>
              {typeStrings.tree.pendingMarker}
            </Pending>
          )}
        </Row>
        {hasChildren &&
          isExpanded &&
          node.children.map((child) => renderNode(child, level + 1))}
      </React.Fragment>
    )
  }

  return (
    <Root
      $dropTarget={overId === ROOT_DROP}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOverId(null)
        }
      }}
      {...dropHandlers(null)}
    >
      <TreeList>{nodes.map((node) => renderNode(node, 0))}</TreeList>
      {dragId !== null && (
        <DetachZone $dropTarget={overId === ROOT_DROP}>
          {canMove(dragId, null)
            ? typeStrings.tree.detachHere
            : typeStrings.tree.alreadyTopLevel}
        </DetachZone>
      )}
    </Root>
  )
}

export default TypesTree
