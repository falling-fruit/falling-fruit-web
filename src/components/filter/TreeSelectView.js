import React from 'react'
import styled from 'styled-components/macro'

import { ReactComponent as ArrowIcon } from './arrow.svg'

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
`

const TreeSelectContainer = styled.ul`
  margin: 0;
  padding: 0;
  height: 55vh;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.secondaryBackground};
  border-radius: 0.375em;

  @media ${({ theme }) => theme.device.mobile} {
    height: 50vh;
  }
`

const TreeNode = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  margin-left: 0.5em;
`

const Checkbox = styled.input`
  border: 2px solid
    ${({ theme, disabled }) => (disabled ? theme.secondaryText : theme.orange)};
  border-radius: 0.225em;
  background: ${({ theme, disabled }) =>
    disabled ? theme.secondaryBackground : theme.transparentOrange};
  width: 1em;
  height: 1em;
  appearance: none;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:checked {
    background-image: url('/checkmark/checkmark.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.secondaryBackground : theme.orange};
  }

  &:indeterminate {
    background-image: url('/checkmark/mixed_checkmark.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`

const NodeContent = styled.span`
  margin-left: 0.25em;
  font-size: 0.875rem;
`

const CommonName = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
  color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.text : theme.secondaryText};
`

const ScientificName = styled.span`
  font-style: italic;
  margin-right: 0.5em;
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
  height: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ChevronSpace = styled.span`
  width: 1em;
  display: inline-block;
`

const TreeSelectView = ({
  renderTree,
  expandedNodes,
  handleToggle,
  handleCheckboxChange,
}) => {
  const renderNode = (node, level) => {
    const isDisabled = node.isDisabled
    const isExpanded = Boolean(expandedNodes.has(node.id) | isDisabled)

    return (
      <React.Fragment key={node.id}>
        <TreeNode style={{ paddingLeft: `${level * 1.25}em` }}>
          <ControlsContainer>
            {node.children.length > 0 ? (
              <ToggleButton
                onClick={() => handleToggle(node.id)}
                disabled={isDisabled}
              >
                <ArrowIcon
                  style={{
                    transform: `rotate(${isExpanded ? 90 : 0}deg)`,
                    transition: 'transform 0.2s',
                    width: '12px',
                    height: '12px',
                    opacity: isDisabled ? 0.5 : 1,
                  }}
                />
              </ToggleButton>
            ) : (
              <ChevronSpace />
            )}
            <Checkbox
              type="checkbox"
              checked={node.isSelected}
              ref={(el) => {
                if (el) {
                  el.indeterminate = node.isIndeterminate
                }
              }}
              onChange={() => !isDisabled && handleCheckboxChange(node)}
              disabled={isDisabled}
            />
          </ControlsContainer>
          <NodeContent>
            <CommonName isDisabled={isDisabled}>{node.commonName}</CommonName>
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

export default TreeSelectView
