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

const splitScientificName = (
  scientificName: string,
): { botanical: string; cultivar: string | null } => {
  const cultivar = extractCultivar(scientificName)
  if (cultivar === null) {
    return { botanical: scientificName.trim(), cultivar: null }
  }
  const quoteIndex = scientificName.indexOf("'")
  return {
    botanical: scientificName.slice(0, quoteIndex).trim(),
    cultivar: scientificName.slice(quoteIndex).trim(),
  }
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

/**
 * The bits of text needed to display a type, leaving styling to the caller.
 *
 * - `common`: plain-text common name, the primary way to refer to the type.
 *   May already include the cultivar when it has been subsumed into the
 *   common name (e.g. "Apple 'Gala'"). Empty string when there is no common
 *   name (in which case the scientific name is the primary label).
 * - `scientific`: the botanical/binomial name, to be rendered in italics per
 *   convention. Empty string when there is no scientific name.
 * - `cultivar`: the cultivar, to be rendered upright (not italic) alongside
 *   the scientific name. `null` when there is no cultivar, or when the
 *   cultivar has been subsumed into `common` (so it is never shown twice).
 * - `pendingReview`: whether this type is awaiting review. Callers that
 *   annotate locations with types (i.e. the type select option) surface this;
 *   the text bits themselves stay clean.
 *
 * Callers derive layout from which bits are present: `common` is the primary
 * (bold) atom when non-empty, otherwise `scientific` (+ `cultivar`) is; the
 * remaining bits form the secondary atom.
 */
export type DisplayComponents = {
  common: string
  scientific: string
  cultivar: string | null
  pendingReview: boolean
  typeId: Id
}

export type TypeSelectMenuEntry = {
  value: Id
  type: LocalizedType
}

export class LocalizedType {
  id: Id
  parentId: Id
  scientificName: string
  commonName: string
  taxonomicRank: number
  urls: { [url: string]: string }
  categories: string[]
  synonyms: string[]
  botanical: string
  cultivar: string | null
  parentCommonName: string
  parentScientificName: string

  constructor(fields: {
    id: Id
    parentId: Id
    scientificName: string
    commonName: string
    taxonomicRank: number
    urls: { [url: string]: string }
    categories: string[]
    synonyms: string[]
    botanical: string
    cultivar: string | null
    parentCommonName?: string
    parentScientificName?: string
  }) {
    this.id = fields.id
    this.parentId = fields.parentId
    this.scientificName = fields.scientificName
    this.commonName = fields.commonName
    this.taxonomicRank = fields.taxonomicRank
    this.urls = fields.urls
    this.categories = fields.categories
    this.synonyms = fields.synonyms
    this.botanical = fields.botanical
    this.cultivar = fields.cultivar
    this.parentCommonName = fields.parentCommonName ?? ''
    this.parentScientificName = fields.parentScientificName ?? ''
  }

  get isSelectable(): boolean {
    return this.id !== PENDING_ID
  }

  get commonNameLabel(): string {
    return this.parentId === PENDING_ID
      ? i18next.t('type.pending_review_item', { name: this.commonName })
      : this.commonName
  }

  searchReference(): string {
    const { commonName, scientificName, cultivar, synonyms, parentCommonName } =
      this

    const referenceStrings = [commonName, scientificName, ...synonyms].filter(
      Boolean,
    )

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

    if (cultivar) {
      referenceStrings.push(cultivar)
    }

    return tokenizeReference(referenceStrings)
  }

  /**
   * The text bits needed to display this type, leaving styling to the caller.
   * See {@link DisplayComponents}.
   *
   * The cultivar is subsumed into `common` (and therefore reported as `null`)
   * when the type has a cultivar, a parent common and scientific name, and
   * either no common name of its own or one identical to the parent's. In that
   * case `common` becomes "<parent common name> <cultivar>".
   */
  displayComponents(): DisplayComponents {
    const cultivarSubsumed =
      Boolean(this.cultivar) &&
      Boolean(this.parentCommonName) &&
      Boolean(this.parentScientificName) &&
      (!this.commonName ||
        this.commonName.toLowerCase() === this.parentCommonName.toLowerCase())

    const common = cultivarSubsumed
      ? `${this.parentCommonName} ${this.cultivar}`
      : this.commonName

    return {
      common,
      scientific: this.botanical,
      cultivar: cultivarSubsumed ? null : this.cultivar,
      pendingReview: this.parentId === PENDING_ID,
      typeId: this.id,
    }
  }

  menuEntry(): TypeSelectMenuEntry {
    return {
      value: this.id,
      type: this,
    }
  }
}

const localize = (type: SchemaType, language: string): LocalizedType => {
  const scientificName = type.scientific_names?.[0] || ''
  let commonName = type.common_names?.[language]?.[0] || ''

  // If both scientific and common names are empty, use English common name as fallback
  if (!scientificName && !commonName) {
    commonName = type.common_names?.en?.[0] || ''
  }

  const synonyms = type.common_names?.[language]?.slice(1) || []

  const { botanical, cultivar } = splitScientificName(scientificName)

  return new LocalizedType({
    id: type.id,
    parentId: type.pending ? PENDING_ID : type.parent_id || 0,
    scientificName,
    commonName,
    taxonomicRank: type.taxonomic_rank || 0,
    urls: type.urls || {},
    categories: type.categories || [],
    synonyms,
    botanical,
    cultivar,
  })
}

const wireUpParents = (localizedTypes: LocalizedType[]): LocalizedType[] => {
  const byId: IdDict<LocalizedType> = {}
  localizedTypes.forEach((type) => {
    byId[type.id] = type
  })
  localizedTypes.forEach((type) => {
    const parent = byId[type.parentId]
    if (parent) {
      type.parentCommonName = parent.commonName
      type.parentScientificName = parent.scientificName
    }
  })
  return localizedTypes
}

const createTypesAccess = (localizedTypes: LocalizedType[]) => {
  wireUpParents(localizedTypes)
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
    return this.localizedTypes.filter((t) => t.isSelectable)
  }

  getType(id: Id): LocalizedType {
    return this.localizedTypes[this.idIndex[id]]
  }

  asMenuEntries(): TypeSelectMenuEntry[] {
    return this.localizedTypes.map((t) => t.menuEntry())
  }

  filter(predicate: (_type: LocalizedType) => boolean): TypesAccess {
    return createTypesAccess(this.localizedTypes.filter(predicate))
  }

  onlyAllowedParents(): TypesAccess {
    return this.filter((t) => t.taxonomicRank !== 9 && t.isSelectable)
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
        t.isSelectable &&
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
    localizedTypes.push(
      new LocalizedType({
        id: PENDING_ID,
        parentId: 0,
        scientificName: '',
        commonName: i18next.t('type.pending_review_category'),
        taxonomicRank: 0,
        urls: {},
        categories: [],
        synonyms: [],
        botanical: '',
        cultivar: null,
      }),
    )
  }
  return createTypesAccess(toDisplayOrder(localizedTypes))
}
