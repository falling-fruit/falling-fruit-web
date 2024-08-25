import { LocalizedType, TypesAccess } from './localizedTypes'

interface RenderTreeNode {
  id: number
  parent: RenderTreeNode | null
  value?: number
  commonName: string
  scientificName: string
  count: number
  searchLabel: string
  children: RenderTreeNode[]
  isSelected: boolean
  isIndeterminate: boolean
  isDisabled: boolean
}

class SelectTreeBuilder {
  private typesAccess: TypesAccess
  private countsById: { [key: number]: number }
  private showOnlyOnMap: boolean
  private searchValue: string
  private selectedTypes: number[]

  constructor(
    typesAccess: TypesAccess,
    countsById: { [key: number]: number },
    showOnlyOnMap: boolean,
    searchValue: string,
    selectedTypes: number[],
  ) {
    this.typesAccess = typesAccess
    this.countsById = countsById
    this.showOnlyOnMap = showOnlyOnMap
    this.searchValue = searchValue.toLowerCase()
    this.selectedTypes = selectedTypes
  }

  private isCultivarWithParentInSelection(
    type: LocalizedType,
    parentId: number | null,
  ): boolean {
    if (!parentId) {
      return false
    }
    const parentType = this.typesAccess.getType(parentId)
    if (!parentType) {
      return false
    }

    const cultivarIndex = type.scientificName?.indexOf("'")
    return (
      cultivarIndex !== -1 &&
      type.scientificName?.startsWith(`${parentType.scientificName} '`)
    )
  }

  buildRenderTree(): RenderTreeNode[] {
    const rootNodes = this.typesAccess.localizedTypes.filter(
      (type) => type.parentId === 0,
    )
    return rootNodes
      .map((node) => this.buildNode(node, null, false))
      .filter((node): node is RenderTreeNode => node !== null)
  }

  private buildNode(
    type: LocalizedType,
    parent: RenderTreeNode | null = null,
    parentMatchesSearch: boolean = false,
  ): RenderTreeNode | null {
    const count = this.getAggregatedCount(type.id)
    if (this.showOnlyOnMap && count === 0) {
      return null
    }
    const searchLabel = `${type.commonName} ${type.scientificName}`.trim()
    const matchesSearch =
      !this.searchValue || searchLabel.toLowerCase().includes(this.searchValue)

    const node: RenderTreeNode = {
      id: type.id,
      parent,
      commonName: type.commonName,
      scientificName: type.scientificName,
      count,
      searchLabel,
      children: [],
      isSelected: this.selectedTypes.includes(type.id),
      isIndeterminate: false,
      isDisabled:
        this.searchValue !== '' && !matchesSearch && !parentMatchesSearch,
    }

    const children = (this.typesAccess.childrenById[type.id] || [])
      .map((childId) =>
        this.buildNode(this.typesAccess.getType(childId), node, matchesSearch),
      )
      .filter((child): child is RenderTreeNode => child !== null)

    if (!matchesSearch && !parentMatchesSearch && children.length === 0) {
      return null
    }

    const isCultivar = this.isCultivarWithParentInSelection(
      type,
      parent?.id ?? null,
    )
    const cultivarIndex = isCultivar ? type.scientificName?.indexOf("'") : -1

    node.children = children
    node.commonName = isCultivar ? '' : type.commonName
    node.scientificName = isCultivar
      ? type.scientificName?.substring(cultivarIndex ?? -1)
      : type.scientificName

    const ownCount = this.getCount(type.id)
    if (children.length && ownCount > 0 && matchesSearch) {
      const childNode: RenderTreeNode = {
        ...node,
        id: -type.id, // Use negative ID to ensure uniqueness
        parent: node,
        count: ownCount,
        value: type.id,
        children: [],
        isSelected: this.selectedTypes.includes(type.id),
        isIndeterminate: false,
        isDisabled: !matchesSearch,
      }
      node.children.unshift(childNode)
    } else if (children.length === 0) {
      node.value = type.id
    }

    // Calculate isSelected and isIndeterminate
    if (node.children.length > 0) {
      const allChildrenSelected = node.children.every(
        (child) => child.isSelected,
      )
      const someChildrenSelected = node.children.some(
        (child) => child.isSelected || child.isIndeterminate,
      )
      node.isSelected = allChildrenSelected
      node.isIndeterminate = !allChildrenSelected && someChildrenSelected
    }
    return node
  }

  private getCount(id: number): number {
    return this.countsById[id] || 0
  }

  private getAggregatedCount(id: number): number {
    let count = this.getCount(id)
    const children = this.typesAccess.childrenById[id] || []
    for (const childId of children) {
      count += this.getAggregatedCount(childId)
    }
    return count
  }
}

function buildSelectTree(
  typesAccess: TypesAccess,
  countsById: { [key: number]: number },
  showOnlyOnMap: boolean,
  searchValue: string,
  selectedTypes: number[],
): RenderTreeNode[] {
  const builder = new SelectTreeBuilder(
    typesAccess,
    countsById,
    showOnlyOnMap,
    searchValue,
    selectedTypes,
  )
  return builder.buildRenderTree()
}

export default buildSelectTree
