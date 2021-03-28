const listToTree = (types) => {
  const typeMap = {}
  typeMap[null] = { id: null, children: [] }

  for (const type of types) {
    typeMap[type.id] = type
    typeMap[type.id].children = []
  }

  for (const type of types) {
    try {
      typeMap[type.parent_id].children.push(type)
    } catch (e) {
      // TODO: some parents types aren't included in API response,
      // presumably because the parent types don't have counts in the view
    }
  }

  console.log(typeMap)

  return typeMap[null] // sentinel root
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
      name: 'Other',
      count: root.count,
      children: [],
      parent_id: root.id,
    }

    root.children.push(other)
  }
}

const replaceRootCounts = (root) => {
  if (root.children.length === 0) {
    // Leaf nodes already have correct count
    return
  }

  let childCounts = 0

  for (const child of root.children) {
    replaceRootCounts(child)
    childCounts += child.count
  }

  root.count = childCounts
}

const addTreeSelectFields = (root, checkedTypes) => {
  // Add necessary fields for react-dropdown-tree-select
  root.label = `${root.name} (${root.count})`
  // This value isn't important, as long as it's unique, because we will be using node.id
  root.value = `${root.name}-${root.id}`
  root.expanded = true
  root.checked = checkedTypes.includes(root.id)
  // Copy children for onChange to access, because TreeSelect resets children to undefined
  root.childrenCopy = root.children
  // Rename to typeId to prevent weird issues
  root.typeId = root.id
  root.id = undefined

  for (const child of root.children) {
    addTreeSelectFields(child, checkedTypes)
  }
}

const buildTypeSchema = (types, checkedTypes) => {
  const tree = listToTree(types)

  moveRootToOther(tree)
  replaceRootCounts(tree)
  addTreeSelectFields(tree, checkedTypes)

  return tree.children
}

const addTypes = (types, node) => {
  if (node.childrenCopy.length === 0) {
    types.push(node.typeId)
  }

  for (const child of node.childrenCopy) {
    addTypes(types, child)
  }
}

const getSelectedTypes = (selectedNodes) => {
  const types = []

  for (const node of selectedNodes) {
    addTypes(types, node)
  }

  return types
}

export { buildTypeSchema, getSelectedTypes }
