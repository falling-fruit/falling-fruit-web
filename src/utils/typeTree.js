/**
 * Recursive helper function to get the type object given a type ID
 * @param {number} targetId - The type ID to find
 * @returns {Object} The type mapping object for the given type ID
 */
export const getTypeObjectFromId = (currentNode, targetId) => {
  if (currentNode.value === targetId) {
    return currentNode
  }

  for (const child of currentNode.children) {
    const res = getTypeObjectFromId(child, targetId)
    if (res) {
      return res
    }
  }
}

/**
 * Recursive helper function to update the 'checked' field of a type object and all of its children
 * @param {Object} currentTypeObject - The current type object to update
 * @param {boolean} checked - Whether the current node and its children should be checked
 */
export const updateCheckedForAllChildren = (currentTypeObject, checked) => {
  currentTypeObject.checked = checked
  for (const child of currentTypeObject.children) {
    updateCheckedForAllChildren(child, checked)
  }
}

/**
 * Helper function to build the tree select data
 * @param {Object[]} types - Array of type objects
 */
export const buildTreeSelectData = (types, filters) => {
  let typeMapping = new Map()
  types.forEach((type) => {
    console.log('HERE: ', filters.types.indexOf(type.id))

    const typeObject = {
      label: type.name,
      value: type.id,
      expanded: true,
      checked: true,
      children: [],
    }
    if (!type.parent_id) {
      typeMapping.set(type.id, typeObject)
    } else {
      const parentTypeObject = typeMapping.get(type.parent_id)
      parentTypeObject.children.push(typeObject)
    }
  })
  return [...typeMapping.values()]
}
