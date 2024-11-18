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
  categories: string[]
  isSelected: boolean
  isIndeterminate: boolean
  isDisabled: boolean
  isVisible: boolean
}

class SelectTreeBuilder {
  private typesAccess: TypesAccess
  private countsById: { [key: number]: number }
  private showOnlyOnMap: boolean
  private searchValue: string
  private selectedTypes: number[]
  private visibleTypeIds: Set<number>
  private enabledCategories: string[]

  constructor(
    typesAccess: TypesAccess,
    countsById: { [key: number]: number },
    showOnlyOnMap: boolean,
    searchValue: string,
    selectedTypes: number[],
    enabledCategories: string[],
  ) {
    this.typesAccess = typesAccess
    this.countsById = countsById
    this.showOnlyOnMap = showOnlyOnMap
    this.searchValue = searchValue.toLowerCase()
    this.selectedTypes = selectedTypes
    this.visibleTypeIds = new Set()
    this.enabledCategories = enabledCategories
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

  private matchesEnabledCategories(type: LocalizedType): boolean {
    return type.categories.length === 0
      ? this.enabledCategories.includes('noCategory')
      : type.categories.some((cat) => this.enabledCategories.includes(cat))
  }

  buildRenderTree(): RenderTreeNode[] {
    const rootNodes = this.typesAccess.localizedTypes.filter(
      (type) => type.parentId === 0,
    )
    return rootNodes
      .map((node) => this.buildNode(node, null, false))
      .filter((node) => node.isVisible)
  }

  private buildNode(
    type: LocalizedType,
    parent: RenderTreeNode | null = null,
    parentMatchesSearch: boolean = false,
  ): RenderTreeNode {
    const countInEnabledCategories = this.getAggregatedCountInEnabledCategories(
      type.id,
    )
    const matchesCategories = this.matchesEnabledCategories(type)

    const isVisible = this.showOnlyOnMap
      ? countInEnabledCategories > 0
      : matchesCategories
    const count = this.getAggregatedCount(type.id)
    const ownCount = this.getCount(type.id)

    const searchLabel = `${type.commonName} ${type.scientificName}`.trim()
    const matchesSearch =
      !this.searchValue || searchLabel.toLowerCase().includes(this.searchValue)

    const node: RenderTreeNode = {
      id: type.id,
      parent,
      commonName: type.commonName,
      isVisible,
      scientificName: type.scientificName,
      count,
      searchLabel,
      children: [],
      categories: type.categories,
      isSelected: this.selectedTypes.includes(type.id),
      isIndeterminate: false,
      isDisabled:
        (this.searchValue !== '' && !matchesSearch && !parentMatchesSearch) ||
        (ownCount < countInEnabledCategories &&
          countInEnabledCategories < count),
    }

    const children = (this.typesAccess.childrenById[type.id] || []).map(
      (childId) =>
        this.buildNode(this.typesAccess.getType(childId), node, matchesSearch),
    )

    if (!matchesSearch && !parentMatchesSearch && children.length === 0) {
      node.isVisible = false
      return node
    }

    if (!node.isDisabled) {
      this.visibleTypeIds.add(type.id)
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

    if (children.length && ownCount > 0 && matchesSearch && matchesCategories) {
      const childNode: RenderTreeNode = {
        ...node,
        id: -type.id,
        parent: node,
        count: ownCount,
        value: type.id,
        children: [],
        isSelected: this.selectedTypes.includes(type.id),
        isIndeterminate: false,
        isDisabled: false,
      }
      node.children.unshift(childNode)
    } else if (children.length === 0) {
      node.value = type.id
    }

    if (node.children.length > 0) {
      const allChildrenSelected = node.children.every(
        (child) => !child.isVisible || child.isSelected,
      )
      const someChildrenSelected = node.children.some(
        (child) =>
          !child.isVisible || child.isSelected || child.isIndeterminate,
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

  getVisibleTypes(): number[] {
    return Array.from(this.visibleTypeIds)
  }

  private getAggregatedCountInEnabledCategories(id: number): number {
    const type = this.typesAccess.getType(id)
    let count = 0

    // Only include count if type matches enabled categories
    if (this.matchesEnabledCategories(type)) {
      count = this.getCount(id)
    }

    // Recursively add counts from children
    const children = this.typesAccess.childrenById[id] || []
    for (const childId of children) {
      count += this.getAggregatedCountInEnabledCategories(childId)
    }

    return count
  }
}

interface SelectTreeResult {
  tree: RenderTreeNode[]
  visibleTypeIds: number[]
}

function buildSelectTree(
  typesAccess: TypesAccess,
  countsById: { [key: number]: number },
  showOnlyOnMap: boolean,
  searchValue: string,
  selectedTypes: number[],
  enabledCategories: string[] = [],
): SelectTreeResult {
  const builder = new SelectTreeBuilder(
    typesAccess,
    countsById,
    showOnlyOnMap,
    searchValue,
    selectedTypes,
    enabledCategories,
  )
  const tree = builder.buildRenderTree()
  const visibleTypeIds = builder.getVisibleTypes()

  return { tree, visibleTypeIds }
}

export default buildSelectTree
