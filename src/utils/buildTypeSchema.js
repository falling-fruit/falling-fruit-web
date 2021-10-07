const listToTree = (types) => {
  const typeMap = {}
  typeMap.null = { name: 'All', children: [] }

  for (const type of types) {
    // Make a copy of the type, to avoid modifying arguments
    // In this case, our preloaded type database in Object.values(typesById)
    typeMap[type.id] = { ...type }
    typeMap[type.id].children = []
  }

  for (const type of types) {
    // TODO: Some parents types aren't included in API response, don't know why
    const parent_id = type.parent_id in typeMap ? type.parent_id : null
    typeMap[parent_id].children.push(typeMap[type.id])
  }

  return typeMap.null // sentinel root
}

const moveRootToOther = (root) => {
  if (root.children.length === 0) {
    return
  }

  for (const child of root.children) {
    moveRootToOther(child)
  }

  if (root.id === null) {
    // Skip sentinel root
    return
  }

  if (root.count > 0) {
    const other = {
      id: root.id,
      name: 'Uncategorized/Other',
      count: root.count,
      children: [],
      parent_id: root.id,
    }

    root.children.push(other)
  }
}

const replaceRootCounts = (root, countsById) => {
  if (root.children.length === 0) {
    root.count = countsById[root.id] ?? 0
    return
  }

  let childCounts = 0

  for (const child of root.children) {
    replaceRootCounts(child, countsById)
    childCounts += child.count
  }

  root.count = childCounts
}

const addRCTreeSelectFields = (root, checkedTypes, showScientificNames) => {
  // Add necessary fields for react-dropdown-tree-select
  const commonName = root.name ?? root.common_names.en[0]
  const scientificName = root.scientific_names?.[0]
  const name =
    scientificName && showScientificNames
      ? `${commonName} [${scientificName}]`
      : commonName

  // Title is what is displayed in the type selector
  root.title = `${name} (${root.count})`
  // Value must be the type id because RCTreeSelect's onChange handler returns an array of the selected node's values
  root.value = `${root.id}`
  // Keep track of whether this type was checked so that selected state can be preserved across re-renders of the tree
  root.checked = checkedTypes.length === 0 || checkedTypes.includes(root.value)

  for (const child of root.children) {
    addRCTreeSelectFields(child, checkedTypes, showScientificNames)
  }
}

const sortChildrenByCount = (node) => {
  // Sort children by descending count, so that available entries appear first
  node.children.sort((typeA, typeB) => typeB.count - typeA.count)
}

const buildTypeSchema = (
  types,
  countsById,
  checkedTypes,
  showScientificName,
) => {
  const tree = listToTree(types)

  moveRootToOther(tree)
  replaceRootCounts(tree, countsById)
  addRCTreeSelectFields(tree, checkedTypes, showScientificName)
  sortChildrenByCount(tree)

  return [tree]
}

export { buildTypeSchema }
