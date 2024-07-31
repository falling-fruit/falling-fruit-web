import { sortBy } from 'lodash'

import { components } from './apiSchema'

type Id = number
type IdDict<T> = { [key: Id]: T }
const PENDING_ID: Id = -1
/* Note:
 * "_Type" here refers to the entity in our problem domain
 * (e.g. kind of fruit)
 * and not type as programming concept
 */
type SchemaType = components['schemas']['Type']
type LocalizedType = {
  id: Id
  parentId: Id
  scientificName: string
  commonName: string
  taxonomicRank: number
  urls: { [url: string]: string }
}

const localize = (type: SchemaType, language: string): LocalizedType => {
  const scientificName = type.scientific_names?.[0] || ''
  let commonName = type.common_names?.[language]?.[0] || ''

  // If both scientific and common names are empty, use English common name as fallback
  if (!scientificName && !commonName) {
    commonName = type.common_names?.en?.[0] || ''
  }

  return {
    id: type.id,
    parentId: type.pending ? PENDING_ID : type.parent_id || 0,
    scientificName,
    commonName,
    taxonomicRank: type.taxonomic_rank || 0,
    urls: type.urls || {},
  }
}

const createTypesAccess = (localizedTypes: LocalizedType[]) => {
  const idIndex: IdDict<number> = {}
  const childrenById: IdDict<Id[]> = {}
  localizedTypes.forEach((type, index) => {
    idIndex[type.id] = index
    if (!childrenById[type.parentId]) {
      childrenById[type.parentId] = []
    }
    childrenById[type.parentId].push(type.id)
  })
  return new TypesAccess(localizedTypes, idIndex, childrenById)
}
class TypesAccess {
  localizedTypes: LocalizedType[]
  idIndex: IdDict<number>
  childrenById: IdDict<Id[]>
  constructor(
    localizedTypes: LocalizedType[],
    idIndex: IdDict<number>,
    childrenById: IdDict<Id[]>,
  ) {
    this.localizedTypes = localizedTypes
    this.idIndex = idIndex
    this.childrenById = childrenById
  }
  getType(id: Id): LocalizedType {
    return this.localizedTypes[this.idIndex[id]]
  }
  getCommonName(id: Id): string {
    const t = this.localizedTypes[this.idIndex[id]]
    return t ? t.commonName : ''
  }

  getScientificName(id: Id): string {
    const t = this.localizedTypes[this.idIndex[id]]
    return t ? t.scientificName : ''
  }
}

const _getTotalCount = (
  result: IdDict<number>,
  id: Id,
  childrenById: IdDict<Id[]>,
  countsById: IdDict<number>,
) => {
  if (id in result) {
    return result[id]
  }
  result[id] = countsById[id] ?? 0
  childrenById[id]?.forEach((childId) => {
    result[id] += _getTotalCount(result, childId, childrenById, countsById)
  })
  return result[id]
}

const calculateAggregatedCounts = (
  childrenById: IdDict<Id[]>,
  countsById: IdDict<number>,
) => {
  const result: IdDict<number> = {}
  for (const id in childrenById) {
    _getTotalCount(result, Number(id), childrenById, countsById)
  }
  return result
}

export const createTypesFrequency = (
  typesAccess: TypesAccess,
  countsById: IdDict<number>,
) =>
  new TypesFrequency(
    typesAccess.localizedTypes,
    typesAccess.idIndex,
    typesAccess.childrenById,
    countsById,
  )

class TypesFrequency extends TypesAccess {
  countsById: IdDict<number>
  aggregatedCountsById: IdDict<number>
  constructor(
    localizedTypes: LocalizedType[],
    idIndex: IdDict<number>,
    childrenById: IdDict<Id[]>,
    countsById: IdDict<number>,
  ) {
    super(localizedTypes, idIndex, childrenById)
    this.countsById = countsById
    this.aggregatedCountsById = calculateAggregatedCounts(
      childrenById,
      countsById,
    )
  }
  getCount(id: Id): number {
    return this.countsById[id] || 0
  }
  getAggregatedCount(id: Id): number {
    return this.aggregatedCountsById[id] || 0
  }

  dropZeroCounts(): TypesFrequency {
    const nonZeroTypes = this.localizedTypes.filter(
      (localizedType) => this.getAggregatedCount(localizedType.id) > 0,
    )
    const newIdIndex: IdDict<number> = {}
    const newChildrenById: IdDict<Id[]> = {}
    const newCountsById: IdDict<number> = {}

    nonZeroTypes.forEach((localizedType, index) => {
      newIdIndex[localizedType.id] = index
      newCountsById[localizedType.id] = this.countsById[localizedType.id]

      if (!newChildrenById[localizedType.parentId]) {
        newChildrenById[localizedType.parentId] = []
      }
      newChildrenById[localizedType.parentId].push(localizedType.id)
    })

    return new TypesFrequency(
      nonZeroTypes,
      newIdIndex,
      newChildrenById,
      newCountsById,
    )
  }
}

const toDisplayOrder = (localizedTypes: LocalizedType[]) =>
  sortBy(localizedTypes, [
    (o) => !o.scientificName,
    'scientificName',
    (o) => -o.taxonomicRank,
  ])

export const typesAccessInLanguage = (
  types: SchemaType[],
  language: string,
) => {
  const localizedTypes = types.map((t: SchemaType) => localize(t, language))
  localizedTypes.push({
    id: PENDING_ID,
    parentId: 0,
    scientificName: '',
    commonName: 'Pending Review',
    taxonomicRank: 0,
    urls: {},
  })
  return createTypesAccess(toDisplayOrder(localizedTypes))
}
