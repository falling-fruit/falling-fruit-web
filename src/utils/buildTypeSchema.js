const listToTree = (types) => {
  const typeMap = {}
  typeMap[null] = { id: null, children: [] }

  for (const type of types) {
    typeMap[type.id] = type
    typeMap[type.id].children = []
  }

  for (const type of types) {
    typeMap[type.parent_id].children.push(type)
  }

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

  const other = {
    name: 'Other',
    count: root.count,
    children: [],
    parent_id: root.id,
  }

  root.children.push(other)
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
  root.checked = true
  // Copy children for onChange to access, because TreeSelect resets children to undefined
  root.childrenCopy = root.children

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

export default buildTypeSchema
