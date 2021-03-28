/**
 * Helper function to build the tree select data
 * @param {Object[]} types - Array of type objects
 */
export const buildTreeSelectData = (types, filterTypes) => {
  const typeMapping = new Map()
  const typeCounts = new Map()

  types.forEach((type) => {
    const typeObject = {
      label: `${type.name} (${type.count})`,
      value: type.id,
      expanded: true,
      checked: filterTypes.includes(type.id),
      children: [],
    }
    if (!type.parent_id) {
      typeMapping.set(type.id, typeObject)
    } else {
      const parentTypeObject = typeMapping.get(type.parent_id)
      parentTypeObject.children.push(typeObject)
    }
    typeObject.children2 = typeObject.children
    typeCounts.set(type.id, type.count)
  })

  typeMapping.forEach((root) => {
    // Add "Other" filter category to the root's children array
    const otherTypeObject = {
      label: `Other (${typeCounts.get(root.value)})`,
      value: root.value,
      expanded: true,
      checked: filterTypes.includes(root.value),
      children: [],
    }
    otherTypeObject.children2 = []
    root.children.push(otherTypeObject)
    root.children2 = root.children

    // Rename label of root node to be the sum of child counts
    let childCount = 0
    root.children.forEach((child) => {
      childCount += typeCounts.get(child.value)
    })
    root.label = `${root.label.slice(
      0,
      root.label.indexOf('('),
    )} (${childCount})`
    // Root still needs value to differentiate from other roots
    root.value = `root ${root.value}`
    // root.checked = true
  })

  return [...typeMapping.values()]
}
