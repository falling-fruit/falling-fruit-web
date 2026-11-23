import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  ancestorIds,
  buildChildrenMap,
  buildSearchIndex,
  buildTree,
  contextIds,
  filterTree,
  flattenNodes,
  isFilterActive,
  matchesFilters,
  orderedTypeIds,
  searchQuery,
  validateTypes,
} from './typeUtils'

export const useTypesTree = ({
  types,
  counts,
  language,
  filters,
  selectedId,
}) => {
  const [expanded, setExpanded] = useState(new Set())
  const [collapsedInFilter, setCollapsedInFilter] = useState(new Set())
  const expandedForSelection = useRef(null)

  const typeList = useMemo(() => types ?? [], [types])
  const typeById = useMemo(
    () => new Map(typeList.map((type) => [type.id, type])),
    [typeList],
  )
  const childrenMap = useMemo(
    () => buildChildrenMap(typeList).children,
    [typeList],
  )
  const searchIndex = useMemo(() => buildSearchIndex(typeList), [typeList])
  const validationErrors = useMemo(
    () => validateTypes(typeList, typeById),
    [typeList, typeById],
  )
  const tree = useMemo(
    () => buildTree(typeList, language),
    [typeList, language],
  )

  const isFiltering = isFilterActive(filters)
  const query = searchQuery(filters)

  const isMatch = useMemo(() => {
    const context = { query, searchIndex, counts, errors: validationErrors }
    return (type) => matchesFilters(type, filters, context)
  }, [filters, query, searchIndex, counts, validationErrors])

  const pinned = useMemo(
    () =>
      isFiltering ? contextIds(selectedId, typeById, childrenMap) : new Set(),
    [isFiltering, selectedId, typeById, childrenMap],
  )

  const { nodes, expandIds } = useMemo(
    () =>
      isFiltering
        ? filterTree(tree, (type) => pinned.has(type.id) || isMatch(type))
        : { nodes: tree, expandIds: new Set() },
    [tree, isFiltering, pinned, isMatch],
  )

  useEffect(() => {
    setCollapsedInFilter(new Set())
  }, [filters])

  useEffect(() => {
    if (
      selectedId &&
      typeById.has(selectedId) &&
      expandedForSelection.current !== selectedId
    ) {
      expandedForSelection.current = selectedId
      const ancestors = ancestorIds(selectedId, typeById)
      setExpanded((previous) => new Set([...previous, ...ancestors]))
      setCollapsedInFilter((previous) => {
        const next = new Set(previous)
        ancestors.forEach((id) => next.delete(id))
        return next
      })
    }
  }, [selectedId, typeById])

  const effectiveExpanded = useMemo(
    () =>
      isFiltering
        ? new Set([...expandIds].filter((id) => !collapsedInFilter.has(id)))
        : expanded,
    [isFiltering, expandIds, collapsedInFilter, expanded],
  )

  const rows = useMemo(
    () =>
      flattenNodes(
        nodes,
        (id) => effectiveExpanded.has(id),
        (type) => !isFiltering || isMatch(type),
      ),
    [nodes, effectiveExpanded, isFiltering, isMatch],
  )

  const indexById = useMemo(
    () => new Map(rows.map((row, index) => [row.type.id, index])),
    [rows],
  )

  const toggle = useCallback(
    (id) => {
      const setter = isFiltering ? setCollapsedInFilter : setExpanded
      setter((previous) => {
        const next = new Set(previous)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    },
    [isFiltering],
  )

  const expand = useCallback(
    (id) => setExpanded((previous) => new Set(previous).add(id)),
    [],
  )

  const { canExpandAll, canCollapseAll } = useMemo(() => {
    let canExpand = false
    let canCollapse = false
    for (const id of isFiltering ? expandIds : childrenMap.keys()) {
      if (effectiveExpanded.has(id)) {
        canCollapse = true
      } else {
        canExpand = true
      }
    }
    return { canExpandAll: canExpand, canCollapseAll: canCollapse }
  }, [isFiltering, expandIds, childrenMap, effectiveExpanded])

  const expandAll = useCallback(() => {
    if (isFiltering) {
      setCollapsedInFilter(new Set())
    } else {
      setExpanded(new Set(childrenMap.keys()))
    }
  }, [isFiltering, childrenMap])

  const collapseAll = useCallback(() => {
    if (isFiltering) {
      setCollapsedInFilter(new Set(expandIds))
    } else {
      setExpanded(new Set())
    }
  }, [isFiltering, expandIds])

  const findNext = useCallback(
    (predicate) => {
      const ids = orderedTypeIds(nodes)
      const start = ids.indexOf(selectedId)
      for (let step = 1; step <= ids.length; step++) {
        const id = ids[(start + step + ids.length) % ids.length]
        if (id !== selectedId && predicate(typeById.get(id))) {
          return id
        }
      }
      return null
    },
    [nodes, selectedId, typeById],
  )

  return {
    typeList,
    typeById,
    childrenMap,
    searchIndex,
    validationErrors,
    nodes,
    rows,
    indexById,
    isFiltering,
    canExpandAll,
    canCollapseAll,
    toggle,
    expand,
    expandAll,
    collapseAll,
    findNext,
  }
}
