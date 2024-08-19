import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components/macro'

import {
  createRenderTree,
  filterTree,
  flattenTree,
} from '../../utils/treeUtils'
import { ReactComponent as ArrowIcon } from './arrow.svg'

const TreeSelectContainer = styled.div`
  padding: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.secondaryBackground};
  border-radius: 0.375em;

  @media ${({ theme }) => theme.device.mobile} {
    height: 50vh;
  }
`

const TreeNode = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const Checkbox = styled.input`
  margin-right: 5px;
  border: 2px solid ${({ theme }) => theme.orange};
  border-radius: 0.225em;
  background: ${({ theme }) => theme.transparentOrange};
  width: 13px;
  height: 13px;
  appearance: none;
  cursor: pointer;

  &:checked {
    background-image: url('/checkmark/checkmark.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-color: ${({ theme }) => theme.orange};
  }

  &:indeterminate {
    background-image: url('/checkmark/mixed_checkmark.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`

const NodeContent = styled.span`
  font-size: 0.875rem;
`

const CommonName = styled.span`
  font-weight: bold;
  margin-right: 5px;
  color: ${({ theme, isSearching }) =>
    isSearching ? theme.text : theme.secondaryText};
`

const ScientificName = styled.span`
  font-style: italic;
  margin-right: 5px;
  color: ${({ theme }) => theme.text};
`

const Count = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 1em;
  height: 0.875em;
`

const TreeSelect = ({ data, onChange, types, searchValue }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set())

  const renderTree = useMemo(() => {
    const tree = createRenderTree(data, types)
    return searchValue ? filterTree(tree, searchValue) : tree
  }, [data, types, searchValue])

  const handleToggle = (nodeId) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  const handleCheckboxChange = useCallback(
    (node) => {
      const flatTree = flattenTree(renderTree)
      const newTypes = new Set(types)

      const updateNodeAndDescendants = (currentNode, shouldSelect) => {
        if (shouldSelect) {
          newTypes.add(currentNode.value)
        } else {
          newTypes.delete(currentNode.value)
        }

        currentNode.children.forEach((child) =>
          updateNodeAndDescendants(child, shouldSelect),
        )
      }

      const updateAncestors = (currentNode) => {
        const parent = flatTree.find((n) => n.rcId === currentNode.rcParentId)
        if (parent) {
          const allChildrenSelected = parent.children.every((child) =>
            newTypes.has(child.value),
          )
          if (allChildrenSelected) {
            newTypes.add(parent.value)
          } else {
            newTypes.delete(parent.value)
          }
          updateAncestors(parent)
        }
      }

      updateNodeAndDescendants(node, !node.isSelected)
      updateAncestors(node)

      onChange(Array.from(newTypes))
    },
    [renderTree, types, onChange],
  )

  const renderNode = (node, level) => {
    const isExpanded = expandedNodes.has(node.rcId)

    return (
      <React.Fragment key={node.rcId}>
        <TreeNode style={{ paddingLeft: `${level}rem` }}>
          {node.children.length > 0 ? (
            <ToggleButton onClick={() => handleToggle(node.rcId)}>
              <ArrowIcon
                style={{
                  transform: `rotate(${isExpanded ? 90 : 0}deg)`,
                  transition: 'transform 0.2s',
                }}
              />
            </ToggleButton>
          ) : (
            <span style={{ width: '1em', marginRight: '5px' }} />
          )}
          <Checkbox
            type="checkbox"
            checked={node.isSelected}
            ref={(el) => {
              if (el) {
                el.indeterminate = node.isIndeterminate
              }
            }}
            onChange={() => handleCheckboxChange(node)}
          />
          <NodeContent>
            <CommonName isSearching={searchValue !== ''}>
              {node.commonName}
            </CommonName>
            {node.scientificName && (
              <ScientificName>{node.scientificName}</ScientificName>
            )}
            <Count>({node.count})</Count>
          </NodeContent>
        </TreeNode>
        {isExpanded &&
          node.children.map((child) => renderNode(child, level + 1))}
      </React.Fragment>
    )
  }

  return (
    <TreeSelectContainer>
      {renderTree.map((node) => renderNode(node, 0))}
    </TreeSelectContainer>
  )
}

export default TreeSelect
