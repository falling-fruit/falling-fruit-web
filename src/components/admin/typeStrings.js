export const TAXONOMIC_RANK_LABELS = [
  'Polyphyletic',
  'Kingdom',
  'Phylum',
  'Class',
  'Order',
  'Family',
  'Genus',
  'Multispecies',
  'Species',
  'Subspecies',
]

export const LINK_LABELS = {
  wikipedia: 'Wikipedia',
  eat_the_weeds: 'Eat the Weeds',
  foraging_texas: 'Foraging Texas',
  urban_mushrooms: 'Urban Mushrooms',
  fruitipedia: 'Fruitipedia',
  usda: 'USDA Plants Database',
}

export const WRITABLE_LINK_CODES = [
  'wikipedia',
  'eat_the_weeds',
  'foraging_texas',
  'urban_mushrooms',
  'fruitipedia',
]

export const CATEGORY_OPTIONS = [
  { value: 'forager', label: 'Forager' },
  { value: 'freegan', label: 'Freegan' },
  { value: 'honeybee', label: 'Honeybee' },
  { value: 'grafter', label: 'Grafter' },
]

export const typeStrings = {
  title: 'Types',

  validation: {
    title: 'This type has validation errors:',
    missingRank: 'Has a scientific name but no taxonomic rank.',
    suggestedParent: (name, parentName) =>
      `Has no parent, but scientific name "${name}" suggests a parent named "${parentName}".`,
    setParent: (label) => `Set parent to ${label}`,
    missingScientificName: (rank) =>
      `Has taxonomic rank ${rank} but no scientific name.`,
    nameShapes: {
      cultivar: 'contains a quoted cultivar',
      infraspecific: 'contains an infraspecific marker (subsp., var., f.)',
      subgenus: 'contains a subgenus or section marker (subg., sect., ser.)',
      single: 'is a single capitalised word',
      binomial: 'is a genus and species epithet',
      hybrid: 'is a hybrid of two species',
    },
    rankMismatch: (name, shape, min, max, rank) =>
      `Scientific name "${name}" ${typeStrings.validation.nameShapes[shape]}, rank should be ${
        min === max
          ? `${min} (${TAXONOMIC_RANK_LABELS[min]})`
          : `${min}–${max} (${TAXONOMIC_RANK_LABELS[min]}–${TAXONOMIC_RANK_LABELS[max]})`
      }, but is ${rank} (${TAXONOMIC_RANK_LABELS[rank]}).`,
    rankNotLower: (rank, parentName, parentRank) =>
      `Rank ${rank} is not lower than the rank of its parent "${parentName}" (${parentRank}).`,
  },

  toolbar: {
    language: 'Language',
    languageNone: 'None (Latin names only)',
    searchPlaceholder: 'Search all names',
    pendingOnly: 'Pending only',
    errorsOnly: 'Errors only',
    withLocationsOnly: 'With locations only',
    withoutLocationsOnly: 'Without locations only',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
  },

  tree: {
    loading: 'Loading types…',
    loadFailed: (message) => `Failed to load types: ${message}`,
    noMatches: 'No types match the current filters.',
    pendingMarker: '(*)',
    pendingTitle: 'Pending review',
    errorMarker: '(*)',
    errorTitle: 'Has validation errors',
    expand: 'Expand',
    collapse: 'Collapse',
    detachHere: 'Drop here to make top-level',
    alreadyTopLevel: 'Already top-level',
    dragHint:
      'Tip: drag a type onto another type to change its parent, or onto the zone at the bottom to make it top-level. Ctrl-click or Shift-click to select several types.',
    moved: (name, parentName) =>
      parentName
        ? `Moved "${name}" under "${parentName}".`
        : `Moved "${name}" to the top level.`,
    movedMany: (count, parentName) =>
      parentName
        ? `Moved ${count} types under "${parentName}".`
        : `Moved ${count} types to the top level.`,
    undo: 'Undo',
    dismiss: 'Dismiss',
  },

  overview: {
    title: 'Overview',
    hint: 'Click a type in the tree to select it.',
    totalTypes: 'Types',
    topLevelTypes: 'Top-level types',
    pendingTypes: 'Pending types',
    typesWithLocations: 'Types with locations',
    typesWithoutLocations: 'Types without locations',
    totalLocations: 'Location types',
    topTypes: 'Most common types',
  },

  details: {
    backToOverview: '← Back',
    loading: 'Loading…',
    loadFailed: (message) => `Failed to load type: ${message}`,
    idLabel: (id) => `Type #${id}`,
    locationCount: (count) =>
      `${count.toLocaleString()} location${count === 1 ? '' : 's'}`,
    childrenInfo: (children, locations) =>
      `${children.toLocaleString()} ${children === 1 ? 'child' : 'children'}, ${locations.toLocaleString()} location${locations === 1 ? '' : 's'} in children`,
    saveFailed: (message) => `Failed to save changes: ${message}`,
    unnamed: 'Unnamed type',
  },

  examples: {
    title: 'Example locations',
    none: 'No locations of this type.',
    loadFailed: (message) => `Failed to load example locations: ${message}`,
  },

  names: {
    title: 'Names',
    language: 'Language',
    name: 'Name',
    scientific: 'Scientific',
    add: 'Add language',
    addSame: 'Add another name in this language',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel',
    chooseLanguage: 'Language',
    namePlaceholder: 'Name',
    confirmDelete: (name) => `Delete the name "${name}"?`,
    lastNameBlocked:
      'A type needs at least one scientific name or English common name.',
  },

  links: {
    title: 'Links',
    resource: 'Resource',
    url: 'URL',
    none: 'No links.',
    add: 'Add link',
    urlPlaceholder: 'https://…',
    confirmDelete: (label) => `Delete the ${label} link?`,
  },

  edibility: {
    title: 'Edibility',
    edit: 'Edit edibility',
    confirm: 'Confirm',
    cancel: 'Cancel',
    empty: 'No edibility information.',
  },

  categories: {
    title: 'Categories',
  },

  notes: {
    title: 'Notes',
    edit: 'Edit notes',
    confirm: 'Confirm',
    cancel: 'Cancel',
    empty: 'No notes.',
  },

  settings: {
    parent: 'Parent',
    rank: 'Taxonomic rank',
    pending: 'Pending review',
    yes: 'Yes',
    no: 'No',
  },

  actions: {
    delete: 'Delete type',
    deleteBlocked:
      'Types that have locations cannot be deleted. Merge instead.',
    confirmDelete: (name, children) =>
      `Delete "${name}"?${children > 0 ? ` Its ${children} child type${children === 1 ? '' : 's'} will be moved to its parent.` : ''}`,
    deleted: 'Type deleted.',
    deleteFailed: (message) => `Failed to delete type: ${message}`,
    merge: 'Merge into another type',
    mergeTarget: 'Merge into',
    mergeConfirmButton: 'Merge',
    mergeCancel: 'Cancel',
    confirmMerge: (name, target, locations, children) =>
      `Merge "${name}" into "${target}"? This moves ${locations.toLocaleString()} location${locations === 1 ? '' : 's'} and ${children} child type${children === 1 ? '' : 's'}, then deletes "${name}". This cannot be undone.`,
    merged: 'Types merged.',
    mergeFailed: (message) => `Failed to merge types: ${message}`,
  },
}
