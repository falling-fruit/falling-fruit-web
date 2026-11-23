import { sortBy } from 'lodash'

import { LANGUAGE_OPTIONS } from '../../i18n'
import {
  displayOrderProperties,
  splitScientificName,
} from '../../utils/localizedTypes'
import { CATEGORY_OPTIONS, typeStrings } from './typeStrings'

export const SCIENTIFIC_KEY = 'scientific'
export const ENGLISH_KEY = 'en'
export const NO_LANGUAGE = 'none'
export const MAX_PARENT_RANK = 8
export const WORLD_BOUNDS = '-85.0511,-180|85.0511,180'

export const languageLabel = (key) =>
  key === SCIENTIFIC_KEY
    ? typeStrings.names.scientific
    : (LANGUAGE_OPTIONS.find((option) => option.value === key)?.label ?? key)

const LANGUAGE_ORDER = [
  ENGLISH_KEY,
  ...LANGUAGE_OPTIONS.map((option) => option.value),
]

export const orderedLanguageKeys = (keys) =>
  [...new Set(keys)].sort((a, b) => {
    const indexA = LANGUAGE_ORDER.indexOf(a)
    const indexB = LANGUAGE_ORDER.indexOf(b)
    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b)
    }
    if (indexA === -1) {
      return 1
    }
    if (indexB === -1) {
      return -1
    }
    return indexA - indexB
  })

export const normalizeText = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export const labelParts = (type, language) => {
  const scientificName = type.scientific_names?.[0] ?? ''
  let common =
    language === NO_LANGUAGE ? '' : (type.common_names?.[language]?.[0] ?? '')
  if (!common && !scientificName) {
    common =
      type.common_names?.[ENGLISH_KEY]?.[0] ??
      Object.values(type.common_names ?? {})[0]?.[0] ??
      ''
  }
  const { botanical, cultivar } = splitScientificName(scientificName)
  return { common, botanical, cultivar, scientificName }
}

export const plainLabel = (type, language) => {
  const { common, scientificName } = labelParts(type, language)
  return [common, scientificName].filter(Boolean).join(' – ') || `#${type.id}`
}

const sortFields = (type, language) => {
  const { common, scientificName } = labelParts(type, language)
  return {
    scientificName,
    commonName: common,
    taxonomicRank: type.taxonomic_rank || 0,
  }
}

const typeOption = (type, language) => {
  const fields = sortFields(type, language)
  return {
    value: type.id,
    label: `${[fields.scientificName, fields.commonName].filter(Boolean).join(' – ')} (${type.id})`,
    ...fields,
  }
}

const sortTypeOptions = (options) => sortBy(options, displayOrderProperties)

export const buildSearchIndex = (types) => {
  const index = new Map()
  types.forEach((type) => {
    const names = [
      ...(type.scientific_names ?? []),
      ...Object.values(type.common_names ?? {}).flat(),
    ]
    index.set(type.id, normalizeText(names.join('\n')))
  })
  return index
}

export const buildChildrenMap = (types) => {
  const ids = new Set(types.map((type) => type.id))
  const children = new Map()
  const roots = []
  types.forEach((type) => {
    if (type.parent_id && ids.has(type.parent_id)) {
      if (!children.has(type.parent_id)) {
        children.set(type.parent_id, [])
      }
      children.get(type.parent_id).push(type)
    } else {
      roots.push(type)
    }
  })
  return { children, roots }
}

export const buildTree = (types, language) => {
  const { children, roots } = buildChildrenMap(types)
  const sortTypes = (list) =>
    sortBy(
      list.map((type) => ({ type, ...sortFields(type, language) })),
      displayOrderProperties,
    ).map(({ type }) => type)
  const toNode = (type, seen) => {
    const nextSeen = new Set(seen).add(type.id)
    return {
      type,
      children: sortTypes(children.get(type.id) ?? [])
        .filter((child) => !nextSeen.has(child.id))
        .map((child) => toNode(child, nextSeen)),
    }
  }
  return sortTypes(roots).map((root) => toNode(root, new Set()))
}

export const filterTree = (nodes, predicate) => {
  const expandIds = new Set()
  const walk = (list) =>
    list.flatMap((node) => {
      const keptChildren = walk(node.children)
      if (keptChildren.length > 0) {
        expandIds.add(node.type.id)
      }
      if (predicate(node.type) || keptChildren.length > 0) {
        return [{ ...node, children: keptChildren }]
      }
      return []
    })
  return { nodes: walk(nodes), expandIds }
}

export const ancestorIds = (typeId, typeById) => {
  const result = []
  const seen = new Set([typeId])
  let parentId = typeById.get(typeId)?.parent_id
  while (parentId && typeById.has(parentId) && !seen.has(parentId)) {
    result.push(parentId)
    seen.add(parentId)
    parentId = typeById.get(parentId).parent_id
  }
  return result
}

const POLYPHYLETIC_RANK = 0

const isRanked = (rank) => rank != null && rank !== POLYPHYLETIC_RANK

const isRankNotLower = (rank, parentRank) =>
  isRanked(rank) && isRanked(parentRank) && rank <= parentRank

const NAME_SHAPES = [
  { shape: 'cultivar', pattern: /'[^']+'/u, min: 8, max: 9 },
  {
    shape: 'infraspecific',
    pattern: /\s(?:subsp|ssp|var|subvar|f|forma)\.\s/u,
    min: 9,
    max: 9,
  },
  {
    shape: 'subgenus',
    pattern: /\s(?:subg|sect|subsect|ser)\.\s/u,
    min: 1,
    max: 6,
  },
  { shape: 'single', pattern: /^\p{Lu}\p{Ll}+$/u, min: 1, max: 7 },
  {
    shape: 'binomial',
    pattern: /^\p{Lu}\p{Ll}+(?: x)? \p{Ll}+$/u,
    min: 8,
    max: 8,
  },
  {
    shape: 'hybrid',
    pattern: /^\p{Lu}\p{Ll}+ \p{Ll}+ x \p{Lu}\p{Ll}+ \p{Ll}+$/u,
    min: 8,
    max: 8,
  },
]

const matchNameShape = (name) =>
  NAME_SHAPES.find(({ pattern }) => pattern.test(name.trim()))

const nameWords = (name) =>
  name.trim().toLowerCase().split(/\s+/).filter(Boolean)

const canBeParent = (type, candidate, typeById) => {
  if (candidate.id === type.id) {
    return false
  }
  const rank = type.taxonomic_rank
  const candidateRank = candidate.taxonomic_rank
  if ((candidateRank ?? 0) > MAX_PARENT_RANK) {
    return false
  }
  if (isRankNotLower(rank, candidateRank)) {
    return false
  }
  return !ancestorIds(candidate.id, typeById).includes(type.id)
}

const rankFixes = (candidates) =>
  candidates.map((rank) => ({ changes: { taxonomic_rank: rank }, rank }))

const MAX_RANK_SUGGESTIONS = 2

const suggestRanks = (match, parent) => {
  if (!match) {
    return []
  }
  const parentRank = parent?.taxonomic_rank
  const candidates = []
  for (let rank = match.min; rank <= match.max; rank++) {
    if (!parentRank || parentRank === POLYPHYLETIC_RANK || rank > parentRank) {
      candidates.push(rank)
    }
  }
  return candidates.length <= MAX_RANK_SUGGESTIONS ? rankFixes(candidates) : []
}

const ATTACHED_ERROR_FIELDS = ['parent_id', 'taxonomic_rank']

export const errorsForField = (errors, field) =>
  (errors ?? []).filter((error) => error.field === field)

export const unattachedErrors = (errors) =>
  (errors ?? []).filter((error) => !ATTACHED_ERROR_FIELDS.includes(error.field))

export const validateTypes = (types, typeById) => {
  const errors = new Map()
  const byName = new Map()
  types.forEach((type) => {
    const names = type.scientific_names ?? []
    names.forEach((name) => {
      const key = nameWords(name).join(' ')
      if (!byName.has(key)) {
        byName.set(key, [])
      }
      byName.get(key).push(type)
    })
  })
  const suggestParents = (type) => {
    const words = nameWords(type.scientific_names?.[0] ?? '')
    for (let length = words.length - 1; length >= 1; length--) {
      const key = words.slice(0, length).join(' ')
      const options = [...new Set(byName.get(key) ?? [])].filter((candidate) =>
        canBeParent(type, candidate, typeById),
      )
      if (options.length > 0) {
        return { name: words.slice(0, length).join(' '), options }
      }
    }
    return null
  }
  types.forEach((type) => {
    const found = []
    const rank = type.taxonomic_rank
    const scientificName = type.scientific_names?.[0]
    const parent = type.parent_id ? typeById.get(type.parent_id) : null
    const match = scientificName ? matchNameShape(scientificName) : null
    if (!type.parent_id && scientificName) {
      const suggestion = suggestParents(type)
      if (suggestion) {
        found.push({
          code: 'suggestedParent',
          field: 'parent_id',
          name: scientificName,
          parentName: suggestion.name,
          fixes: suggestion.options.map((option) => ({
            changes: { parent_id: option.id },
            typeId: option.id,
          })),
        })
      }
    }
    if (rank == null && scientificName) {
      found.push({
        code: 'missingRank',
        field: 'taxonomic_rank',
        fixes: suggestRanks(match, parent),
      })
    }
    if (isRanked(rank) && !scientificName) {
      found.push({ code: 'missingScientificName', field: 'scientific_names' })
    }
    if (isRanked(rank) && match) {
      if (rank < match.min || rank > match.max) {
        found.push({
          code: 'rankMismatch',
          field: 'taxonomic_rank',
          name: scientificName,
          shape: match.shape,
          min: match.min,
          max: match.max,
          fixes: suggestRanks(match, parent),
        })
      }
    }
    if (parent && isRankNotLower(rank, parent.taxonomic_rank)) {
      found.push({
        code: 'rankNotLower',
        field: 'taxonomic_rank',
        parentId: parent.id,
      })
    }
    if (found.length > 0) {
      errors.set(type.id, found)
    }
  })
  return errors
}

export const descendantIds = (typeId, childrenMap) => {
  const result = new Set()
  const stack = [typeId]
  while (stack.length > 0) {
    const current = stack.pop()
    ;(childrenMap.get(current) ?? []).forEach((child) => {
      if (!result.has(child.id)) {
        result.add(child.id)
        stack.push(child.id)
      }
    })
  }
  return result
}

export const hasRequiredName = (type) =>
  (type.scientific_names?.length ?? 0) > 0 ||
  (type.common_names?.[ENGLISH_KEY]?.length ?? 0) > 0

export const withNames = (type, key, names) => {
  if (key === SCIENTIFIC_KEY) {
    return { scientific_names: names }
  }
  const commonNames = { ...type.common_names }
  if (names.length > 0) {
    commonNames[key] = names
  } else {
    delete commonNames[key]
  }
  return { common_names: commonNames }
}

export const parseNames = (text) =>
  text
    .split(/\s*,\s*/u)
    .map((name) => name.trim())
    .filter(Boolean)

export const formatNames = (names) => (names ?? []).join(', ')

export const searchQuery = (filters) => normalizeText(filters.search.trim())

export const UNCATEGORIZED = 'none'

export const DEFAULT_FILTERS = {
  search: '',
  conditions: [],
}

const CONDITION_PREDICATES = {
  pending: (type) => Boolean(type.pending),
  errors: (type, { errors }) => errors.has(type.id),
  withLocations: (type, { counts }) => counts.get(type.id) > 0,
  withoutLocations: (type, { counts }) => !(counts.get(type.id) > 0),
  [UNCATEGORIZED]: (type) => (type.categories ?? []).length === 0,
  ...Object.fromEntries(
    CATEGORY_OPTIONS.map(({ value }) => [
      value,
      (type) => (type.categories ?? []).includes(value),
    ]),
  ),
}

export const isFilterActive = (filters) =>
  Boolean(searchQuery(filters)) || filters.conditions.length > 0

export const matchesFilters = (
  type,
  filters,
  { query, searchIndex, counts, errors },
) =>
  (!query || searchIndex.get(type.id).includes(query)) &&
  filters.conditions.every((condition) =>
    CONDITION_PREDICATES[condition](type, { counts, errors }),
  )

export const contextIds = (selectedId, typeById, childrenMap) => {
  const ids = new Set()
  const selected = typeById.get(selectedId)
  if (!selected) {
    return ids
  }
  ids.add(selectedId)
  const addChildren = (parentId) =>
    (childrenMap.get(parentId) ?? []).forEach((child) => ids.add(child.id))
  addChildren(selectedId)
  if (selected.parent_id) {
    addChildren(selected.parent_id)
  }
  return ids
}

export const buildTypeOptions = (types, language, searchIndex) =>
  sortTypeOptions(
    types.map((type) => ({
      ...typeOption(type, language),
      type,
      search: searchIndex.get(type.id),
    })),
  )

export const matchesOptionSearch = (search, input) =>
  normalizeText(input)
    .split(/\s+/u)
    .filter(Boolean)
    .every((token) => search.includes(token))

export const flattenNodes = (nodes, isExpanded, isMatch) => {
  const rows = []
  const walk = (list, level) => {
    list.forEach((node) => {
      const hasChildren = node.children.length > 0
      const expanded = hasChildren && isExpanded(node.type.id)
      rows.push({
        type: node.type,
        level,
        hasChildren,
        isExpanded: expanded,
        isMatch: isMatch(node.type),
      })
      if (expanded) {
        walk(node.children, level + 1)
      }
    })
  }
  walk(nodes, 0)
  return rows
}

export const orderedTypeIds = (nodes) => {
  const ids = []
  const walk = (list) =>
    list.forEach((node) => {
      ids.push(node.type.id)
      walk(node.children)
    })
  walk(nodes)
  return ids
}
