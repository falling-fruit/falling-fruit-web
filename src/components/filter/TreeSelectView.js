import React from 'react'
import styled from 'styled-components/macro'

import { ReactComponent as ArrowIcon } from './arrow.svg'

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  width: 44px; // 20px for toggle + 16px for checkbox + 8px for margin
  justify-content: flex-end;
`

const TreeSelectContainer = styled.div`
  padding: 5px 5px 12px 5px;
  height: 400px; //TODO
  display: flex;
  flex-direction: column;
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
  white-space: nowrap;
`

const Checkbox = styled.input`
  border: 2px solid
    ${({ theme, disabled }) => (disabled ? theme.secondaryText : theme.orange)};
  border-radius: 0.225em;
  background: ${({ theme, disabled }) =>
    disabled ? theme.secondaryBackground : theme.transparentOrange};
  min-width: 16px;
  width: 16px;
  min-height: 16px;
  height: 16px;
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
  font-size: 0.875rem;
`

const CommonName = styled.span`
  font-weight: bold;
  margin-right: 5px;
  color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.text : theme.secondaryText};
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
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ChevronSpace = styled.span`
  width: 20px;
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
        <TreeNode style={{ paddingLeft: `${level * 20}px` }}>
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
