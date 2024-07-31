import TreeNodeText from '../components/filter/TreeNodeText'
import { createTypesFrequency } from './localizedTypes'

const RC_ROOT_ID = 'RC_ROOT'

const constructTypesTreeForSelection = (
  typesAccess,
  countsById,
  showOnlyOnMap,
) => {
  let typesFrequency = createTypesFrequency(typesAccess, countsById)

  if (showOnlyOnMap) {
    typesFrequency = typesFrequency.dropZeroCounts()
  }

  const treeNodes = typesFrequency.localizedTypes
    .map((type) => {
      const count = typesFrequency.getAggregatedCount(type.id)
      const isParentInSelectionWithOwnValue =
        typesFrequency.childrenById[type.id] &&
        typesFrequency.getCount(type.id) > 0

      const node = {
        ...type,
        count,
        rcId: `${type.id}`,
        value: isParentInSelectionWithOwnValue
          ? `extra-group-value-${type.id}`
          : `${type.id}`,
        rcParentId: type.parentId === 0 ? RC_ROOT_ID : `${type.parentId}`,
        searchValue: `${type.commonName} ${type.scientificName}`.trim(),
      }

      if (isParentInSelectionWithOwnValue) {
        const childNode = {
          ...node,
          count: typesFrequency.getCount(type.id),
          rcId: `extra-child-id-${type.id}`,
          value: `${type.id}`,
          rcParentId: `${type.id}`,
        }
        return [childNode, node]
      }

      return node
    })
    .flat()

  return treeNodes.map((node) => ({
    ...node,
    title: (
      <TreeNodeText
        commonName={node.commonName}
        shouldIncludeScientificName={!!node.scientificName}
        shouldIncludeCommonName={!!node.commonName}
        scientificName={node.scientificName}
        count={node.count}
      />
    ),
  }))
}

export { constructTypesTreeForSelection, RC_ROOT_ID }
