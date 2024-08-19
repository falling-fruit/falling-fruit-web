// Helper function to create a convenient data structure for rendering
export const createRenderTree = (typesTreeForSelection, selectedTypes) => {
  const buildNode = (node) => {
    const children = typesTreeForSelection
      .filter((child) => child.rcParentId === node.rcId)
      .map(buildNode)

    const allChildrenSelected =
      children.length > 0 && children.every((child) => child.isSelected)
    const someChildrenSelected = children.some(
      (child) => child.isSelected || child.isIndeterminate,
    )

    return {
      ...node,
      children,
      isSelected: selectedTypes.includes(node.value) || allChildrenSelected,
      isIndeterminate: !allChildrenSelected && someChildrenSelected,
    }
  }

  return typesTreeForSelection
    .filter((node) => node.rcParentId === 'RC_ROOT')
    .map(buildNode)
}

// Helper function to flatten the tree for easier searching
export const flattenTree = (tree) => {
  const flatten = (node, result = []) => {
    result.push(node)
    node.children.forEach((child) => flatten(child, result))
    return result
  }

  return tree.reduce((acc, node) => flatten(node, acc), [])
}

// Helper function to filter the tree based on search value
export const filterTree = (tree, searchValue) => {
  const lowercaseSearch = searchValue.toLowerCase()

  const filterNode = (node) => {
    const matchesSearch = node.searchValue
      .toLowerCase()
      .includes(lowercaseSearch)
    const filteredChildren = node.children
      .map(filterNode)
      .filter((child) => child !== null)

    if (matchesSearch || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      }
    }

    return null
  }

  return tree.map(filterNode).filter((node) => node !== null)
}
