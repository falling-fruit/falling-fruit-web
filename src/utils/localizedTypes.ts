import i18next from 'i18next'
import { sortBy } from 'lodash'

import { components } from './apiSchema'
import { tokenizeReference } from './tokenize'

const CULTIVAR_REGEX = new RegExp("'(.*)'")

/**
 * Extracts the cultivar from a scientific name.
 *
 * The cultivar is expected to be between the first and last single quotes,
 * and not contain ' x ' (which suggests a hybrid of two cultivars).
 *
 * @param {string} scientificName - Scientific name.
 * @returns {string | null} - Cultivar if found.
 * @examples
 * extractCultivar("")  // null
 * extractCultivar("Malus")  // null
 * extractCultivar("Malus 'Gala'")  // 'Gala'
 * extractCultivar("Malus 'Gala' TM")  // 'Gala'
 * extractCultivar("Malus 'Gala' x Malus 'Gaga")  // null
 */
const extractCultivar = (scientificName: string): string | null => {
  const cultivar = scientificName.match(CULTIVAR_REGEX)
  if (!cultivar || cultivar[1].includes(' x ')) {
    return null
  }
  return cultivar[1]
}

type Id = number
type IdDict<T> = { [key: Id]: T }
const PENDING_ID: Id = -1
/* Note:
 * "_Type" here refers to the entity in our problem domain
 * (e.g. kind of fruit)
 * and not type as programming concept
 */
type SchemaType = components['schemas']['Type']
export type LocalizedType = {
  id: Id
  parentId: Id
  scientificName: string
  commonName: string
  taxonomicRank: number
  urls: { [url: string]: string }
  categories: string[]
  synonyms: string[]
  cultivar: string | null
}

type TypeSelectMenuEntry = {
  value: Id
  searchReference: string
  scientificName: string
  commonName: string
  label: string
  synonyms: string[]
  taxonomicRank: number
}

const localize = (type: SchemaType, language: string): LocalizedType => {
  const scientificName = type.scientific_names?.[0] || ''
  let commonName = type.common_names?.[language]?.[0] || ''

  // If both scientific and common names are empty, use English common name as fallback
  if (!scientificName && !commonName) {
    commonName = type.common_names?.en?.[0] || ''
  }

  const synonyms = type.common_names?.[language]?.slice(1) || []

  // Extract cultivar if present
  const cultivar = extractCultivar(scientificName)

  return {
    id: type.id,
    parentId: type.pending ? PENDING_ID : type.parent_id || 0,
    scientificName,
    commonName,
    taxonomicRank: type.taxonomic_rank || 0,
    urls: type.urls || {},
    categories: type.categories || [],
    synonyms,
    cultivar,
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

const toMenuEntry = (
  localizedType: LocalizedType,
  parentCommonName: string,
) => {
  const { id, parentId, commonName, scientificName, taxonomicRank, synonyms } =
    localizedType

  const referenceStrings = [commonName, scientificName, ...synonyms]

  // If common name starts with 'common ' or 'Common ', add version without that prefix
  if (commonName.toLowerCase().startsWith('common ')) {
    referenceStrings.push(commonName.replace(/^[Cc]ommon\s+/, ''))
  }

  // Add parent name to references if it appears within common name but not at start
  if (
    parentCommonName &&
    commonName.includes(parentCommonName.toLowerCase()) &&
    !commonName.startsWith(parentCommonName)
  ) {
    referenceStrings.push(parentCommonName)
  }

  const cultivar = extractCultivar(scientificName)
  if (cultivar) {
    referenceStrings.push(cultivar)
  }

  const commonNameLabel =
    parentId === PENDING_ID
      ? i18next.t('type.pending_review_item', { name: commonName })
      : commonName

  return {
    value: id,
    searchReference: tokenizeReference(referenceStrings),
    commonName: commonNameLabel,
    label: commonNameLabel,
    scientificName: scientificName,
    taxonomicRank,
    synonyms,
  }
}

export class TypesAccess {
  localizedTypes: LocalizedType[]
  idIndex: IdDict<number>
  childrenById: IdDict<Id[]>
  isEmpty: boolean
  constructor(
    localizedTypes: LocalizedType[],
    idIndex: IdDict<number>,
    childrenById: IdDict<Id[]>,
  ) {
    this.localizedTypes = localizedTypes
    this.idIndex = idIndex
    this.childrenById = childrenById
    this.isEmpty = localizedTypes.length === 0
  }

  selectableTypes(): LocalizedType[] {
    return this.localizedTypes.filter((t) => t.id !== PENDING_ID)
  }

  isSelectable(id: Id): boolean {
    return id !== PENDING_ID
  }

  getType(id: Id): LocalizedType {
    return this.localizedTypes[this.idIndex[id]]
  }

  getParentType(id: Id): LocalizedType | null {
    const type = this.getType(id)
    return type ? this.getType(type.parentId) : null
  }

  getCommonName(id: Id): string {
    const t = this.localizedTypes[this.idIndex[id]]
    return t ? t.commonName : ''
  }

  getScientificName(id: Id): string {
    const t = this.localizedTypes[this.idIndex[id]]
    return t ? t.scientificName : ''
  }
  asMenuEntries(): TypeSelectMenuEntry[] {
    return this.localizedTypes.map((t) =>
      toMenuEntry(t, this.getCommonName(t.parentId)),
    )
  }
  getMenuEntry(id: Id): TypeSelectMenuEntry | null {
    const t = this.localizedTypes[this.idIndex[id]]
    return t ? toMenuEntry(t, this.getCommonName(t.parentId)) : null
  }

  filter(predicate: (_type: LocalizedType) => boolean): TypesAccess {
    const filteredTypes = this.localizedTypes.filter(predicate)
    const newIdIndex: IdDict<number> = {}
    const newChildrenById: IdDict<Id[]> = {}

    filteredTypes.forEach((type, index) => {
      newIdIndex[type.id] = index
      if (!newChildrenById[type.parentId]) {
        newChildrenById[type.parentId] = []
      }
      newChildrenById[type.parentId].push(type.id)
    })

    return new TypesAccess(filteredTypes, newIdIndex, newChildrenById)
  }

  onlyAllowedParents(): TypesAccess {
    return this.filter(
      ({ taxonomicRank, id }) => taxonomicRank !== 9 && id !== PENDING_ID,
    )
  }

  addType(newType: SchemaType, language: string): TypesAccess {
    return createTypesAccess([
      ...this.localizedTypes,
      localize(newType, language),
    ])
  }

  selectableTypesWithCategories(...categories: string[]): LocalizedType[] {
    return this.localizedTypes.filter(
      (t) =>
        t.id !== PENDING_ID &&
        t.categories.some((category) => categories.includes(category)),
    )
  }
}

export const displayOrderProperties = [
  (o: LocalizedType) => !o.scientificName,
  'scientificName',
  (o: LocalizedType) => -o.taxonomicRank,
  'commonName',
]

const toDisplayOrder = (localizedTypes: LocalizedType[]) =>
  sortBy(localizedTypes, displayOrderProperties)

export const typesAccessInLanguage = (
  types: SchemaType[],
  language: string,
) => {
  const localizedTypes = types.map((t: SchemaType) => localize(t, language))
  if (types.some((type) => type.pending)) {
    localizedTypes.push({
      id: PENDING_ID,
      parentId: 0,
      scientificName: '',
      commonName: i18next.t('type.pending_review_category'),
      taxonomicRank: 0,
      urls: {},
      categories: [],
      synonyms: [],
      cultivar: null,
    })
  }
  return createTypesAccess(toDisplayOrder(localizedTypes))
}
