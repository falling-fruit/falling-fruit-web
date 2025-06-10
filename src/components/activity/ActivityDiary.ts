import { sortBy } from 'lodash'

import { MIN_LOCATION_ZOOM } from '../../constants/map'
import { components } from '../../utils/apiSchema'
import { viewToString } from '../../utils/appUrl'
import {
  displayOrderProperties,
  LocalizedType,
  TypesAccess,
} from '../../utils/localizedTypes'
import { tokenizeReference } from '../../utils/tokenize'
import { formatISOString } from '../entry/textFormatters'

interface CityCount {
  city: string
  state: string
  country: string
  count: number
  filteredCount?: number
  value: string
  label: string
  searchReference: string
  isCoordinates?: boolean
  coordinatesGrid?: string
}

interface TypeCount extends LocalizedType {
  count: number
  filteredCount?: number
  value: number
  label: string
  searchReference: string
}

function createTypeCount(
  typeId: number,
  commonName: string,
  scientificName: string,
  count: number = 0,
  synonyms?: string[],
): TypeCount {
  const displayName = commonName || scientificName || `Type ${typeId}`

  const referenceStrings = [
    commonName,
    scientificName,
    ...(synonyms || []),
  ].filter(Boolean)

  return {
    id: typeId,
    parentId: 0,
    taxonomicRank: 0,
    urls: {},
    categories: [],
    cultivar: null,
    commonName,
    scientificName,
    synonyms: synonyms || [],
    count,
    value: typeId,
    label: displayName,
    searchReference: tokenizeReference(referenceStrings),
  }
}

interface LocationTypes {
  locationId: number
  types: Array<LocalizedType>
  url: string
  isSelected: boolean
}

interface Place {
  city: string
  state: string
  country: string
  coordinatesGrid: string
}

interface ActivityGroup {
  author: string
  userId: number
  place: Place
  date: string
  added: LocationTypes[]
  edited: LocationTypes[]
  visited: LocationTypes[]
}

interface DiaryEntry {
  date: string
  formattedDate: string
  activities: ActivityGroup[]
}

function getDaysAgo(date: Date): number {
  const now = new Date()
  const hoursAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600))
  return Math.floor(hoursAgo / 24)
}

function formatPeriodName(
  daysAgo: number,
  date: string,
  t: Function,
  language: string,
): string {
  if (daysAgo <= 14) {
    if (daysAgo === 0) {
      return t('time.last_24_hours')
    } else if (daysAgo === 1) {
      const time = t('time.days.one', { count: daysAgo })
      return t('time.time_ago', { time })
    } else {
      const time = t('time.days.other', { count: daysAgo })
      return t('time.time_ago', { time })
    }
  } else {
    return formatISOString(date, language)
  }
}

function deduplicateByLocationId(locations: LocationTypes[]): LocationTypes[] {
  const seen = new Set<number>()
  return locations.filter((location) => {
    if (seen.has(location.locationId)) {
      return false
    }
    seen.add(location.locationId)
    return true
  })
}

export function createActivityDiary(
  changes: components['schemas']['LocationChange'][],
  typesAccess: TypesAccess,
  t: Function,
  language: string,
): ActivityDiary {
  const entries = transformActivityData(changes, typesAccess, t, language)
  return new ActivityDiary(entries)
}

function transformActivityData(
  changes: components['schemas']['LocationChange'][],
  typesAccess: TypesAccess,
  t: Function,
  language: string,
): DiaryEntry[] {
  // Calculate formattedDate for each change and group by it
  const changesByFormattedDate = changes.reduce(
    (
      groups: Record<string, components['schemas']['LocationChange'][]>,
      change,
    ) => {
      const date = new Date(change.created_at)
      const daysAgo = getDaysAgo(date)
      const formattedDate = formatPeriodName(
        daysAgo,
        change.created_at,
        t,
        language,
      )

      groups[formattedDate] = groups[formattedDate] || []
      groups[formattedDate].push(change)
      return groups
    },
    {},
  )

  // Transform each time period
  return Object.entries(changesByFormattedDate).map(
    ([formattedDate, periodChanges]) => {
      // Group changes by unique user+location+date combination
      const groupedActivities = new Map<string, ActivityGroup>()

      // Get the date for this period (using the first change's date)
      const periodDate =
        periodChanges.length > 0
          ? periodChanges[0].created_at
          : new Date().toISOString()

      periodChanges.forEach((change) => {
        const date = change.created_at.split('T')[0]
        const locationKey = change.city
          ? `${change.city},${change.state},${change.country}`
          : `${change.lat.toFixed(2)},${change.lng.toFixed(2)}`
        const groupKey = `${change.author}-${locationKey}-${date}`

        if (!groupedActivities.has(groupKey)) {
          groupedActivities.set(groupKey, {
            author: change.author,
            userId: change.user_id,
            place: {
              city: change.city,
              state: change.state,
              country: change.country,
              coordinatesGrid: `${change.lat.toFixed(2)},${change.lng.toFixed(2)}`,
            },
            date,
            added: [],
            edited: [],
            visited: [],
          })
        }

        const group = groupedActivities.get(groupKey)!
        const types = change.type_ids
          .map((typeId) => typesAccess.getType(typeId))
          .filter(Boolean)

        const locationTypes: LocationTypes = {
          locationId: change.location_id,
          types,
          url: `/locations/${change.location_id}/${viewToString(
            change.lat,
            change.lng,
            MIN_LOCATION_ZOOM,
          )}`,
          isSelected: true,
        }
        switch (change.description) {
          case 'added':
            group.added.push(locationTypes)
            break
          case 'edited':
            group.edited.push(locationTypes)
            break
          case 'visited':
            group.visited.push(locationTypes)
            break
          default:
            console.error(change.description)
            group.added.push(locationTypes)
        }
      })

      // Deduplicate activities - remove locations that appear in multiple categories
      groupedActivities.forEach((group) => {
        // Get all location IDs that were added
        const addedIds = new Set(group.added.map((l) => l.locationId))
        // Get all location IDs that were edited
        const editedIds = new Set(group.edited.map((l) => l.locationId))

        // Filter out visited locations that were also added or edited
        group.visited = group.visited.filter(
          (l) => !addedIds.has(l.locationId) && !editedIds.has(l.locationId),
        )

        //Filter out edited locations that were also added
        group.edited = group.edited.filter((l) => !addedIds.has(l.locationId))

        // Apply final deduplication to all three arrays based on location ID
        group.added = deduplicateByLocationId(group.added)
        group.edited = deduplicateByLocationId(group.edited)
        group.visited = deduplicateByLocationId(group.visited)
      })

      return {
        date: periodDate,
        formattedDate,
        activities: Array.from(groupedActivities.values()),
      }
    },
  )
}

export class ActivityDiary {
  entries: DiaryEntry[]

  constructor(entries: DiaryEntry[]) {
    this.entries = entries
  }

  /**
   * Calculates type counts from the transformed activity data
   *
   * @param selectedPlaces Optional array of place names to filter by
   * @returns Array of TypeCount objects sorted by count (descending)
   */
  calculateTypeCounts(selectedPlaces: string[] = []): TypeCount[] {
    // Map to store type counts by typeId
    const typeCountMap: Record<number, TypeCount> = {}
    // Map to store filtered type counts by typeId
    const filteredTypeCountMap: Record<number, number> = {}

    // Process each entry and its activities
    this.entries.forEach((entry) => {
      entry.activities.forEach((activity) => {
        // Check if place matches filter
        const placeMatches = this.matchesPlace(activity.place, selectedPlaces)

        // Process all location types from added, edited, and visited
        const allLocationTypes = [
          ...activity.added,
          ...activity.edited,
          ...activity.visited,
        ]

        // Track processed location IDs to avoid counting the same location multiple times
        const processedLocationIds = new Set<number>()

        allLocationTypes.forEach((locationTypes) => {
          // Skip if we've already processed this location
          if (processedLocationIds.has(locationTypes.locationId)) {
            return
          }

          // Mark this location as processed
          processedLocationIds.add(locationTypes.locationId)

          // Count each type in this location
          locationTypes.types.forEach((type) => {
            const typeId = type.id

            if (!typeCountMap[typeId]) {
              typeCountMap[typeId] = createTypeCount(
                typeId,
                type.commonName || '',
                type.scientificName || '',
                0,
                type.synonyms,
              )
            }

            // Always increment the total count
            typeCountMap[typeId].count++

            // If place matches filter, increment the filtered count
            if (selectedPlaces.length === 0 || placeMatches) {
              filteredTypeCountMap[typeId] =
                (filteredTypeCountMap[typeId] || 0) + 1
            }
          })
        })
      })
    })

    // Add filtered count information to each type
    Object.values(typeCountMap).forEach((type) => {
      if (selectedPlaces.length > 0) {
        type.filteredCount = filteredTypeCountMap[type.id] || 0
      }
    })

    // Convert to array, filter out zeros if filtered, and sort by count (descending), then by display order criteria
    const typeCounts = Object.values(typeCountMap)
    const filteredTypeCounts =
      selectedPlaces.length > 0
        ? typeCounts.filter(
            (type) => type.filteredCount && type.filteredCount > 0,
          )
        : typeCounts

    return sortBy(filteredTypeCounts, [
      (o) => -(selectedPlaces.length > 0 ? o.filteredCount || 0 : o.count),
      ...displayOrderProperties,
    ])
  }

  /**
   * Calculates city counts from the transformed activity data
   *
   * @param selectedTypes Optional array of type IDs to filter by
   * @returns Array of CityCount objects
   */
  calculateCityCounts(selectedTypes: number[] = []): CityCount[] {
    // Map to store city counts
    const cityCountMap: Record<string, CityCount> = {}

    // Process each entry and its activities
    this.entries.forEach((entry) => {
      entry.activities.forEach((activity) => {
        let key: string

        // Check if any location in this activity has a matching type
        const hasMatchingType =
          selectedTypes.length === 0 ||
          ['added', 'edited', 'visited'].some((interactionType) =>
            activity[
              interactionType as keyof Pick<
                ActivityGroup,
                'added' | 'edited' | 'visited'
              >
            ].some((loc) =>
              loc.types.some((type) => selectedTypes.includes(type.id)),
            ),
          )

        if (activity.place.city) {
          // Create a unique key for this city+state+country combination
          key = `${activity.place.city}|${activity.place.state}|${activity.place.country}`

          if (!cityCountMap[key]) {
            const cityName = activity.place.city
            const locationDetails = [
              activity.place.state,
              activity.place.country,
            ]
              .filter(Boolean)
              .join(', ')
            const fullCityName = [cityName, locationDetails]
              .filter(Boolean)
              .join(', ')

            const referenceStrings = [
              fullCityName,
              activity.place.city,
              activity.place.state,
              activity.place.country,
            ].filter(Boolean)

            cityCountMap[key] = {
              city: activity.place.city,
              state: activity.place.state,
              country: activity.place.country,
              count: 0,
              filteredCount: 0,
              value: fullCityName,
              label: fullCityName,
              searchReference: tokenizeReference(referenceStrings),
              isCoordinates: false,
            }
          }
        } else {
          // Handle coordinate-only places
          key = `coords|${activity.place.coordinatesGrid}`

          if (!cityCountMap[key]) {
            const coordsValue = activity.place.coordinatesGrid

            cityCountMap[key] = {
              city: '',
              state: '',
              country: '',
              coordinatesGrid: coordsValue,
              count: 0,
              filteredCount: 0,
              value: coordsValue,
              label: coordsValue,
              searchReference: tokenizeReference([coordsValue]),
              isCoordinates: true,
            }
          }
        }

        // Always increment the total count
        cityCountMap[key].count++

        // If this activity has a matching type, increment the filtered count
        if (hasMatchingType) {
          cityCountMap[key].filteredCount =
            (cityCountMap[key].filteredCount || 0) + 1
        }
      })
    })

    // Convert to array, filter out zeros if filtered, and sort by count (descending), then alphabetically by country, state, city
    // Places with missing data (country/state/city) are sorted to the end
    const cityCounts = Object.values(cityCountMap)
    const filteredCityCounts =
      selectedTypes.length > 0
        ? cityCounts.filter(
            (city) => city.filteredCount && city.filteredCount > 0,
          )
        : cityCounts

    return filteredCityCounts.sort((a, b) => {
      // First sort by count (descending)
      const countDiff =
        (selectedTypes.length > 0 ? b.filteredCount || 0 : b.count) -
        (selectedTypes.length > 0 ? a.filteredCount || 0 : a.count)
      if (countDiff !== 0) {
        return countDiff
      }

      // Sort coordinates to the end
      if (a.isCoordinates !== b.isCoordinates) {
        return a.isCoordinates ? 1 : -1
      }

      // If both are coordinates, sort by coordinates
      if (a.isCoordinates && b.isCoordinates) {
        return (a.coordinatesGrid || '').localeCompare(b.coordinatesGrid || '')
      }

      // Sort by presence of country (entries with country come first)
      if (!!a.country !== !!b.country) {
        return a.country ? -1 : 1
      }

      // If countries are equal or both missing, sort alphabetically by country
      if (a.country !== b.country) {
        return (a.country || '').localeCompare(b.country || '')
      }

      // Sort by presence of state (entries with state come first)
      if (!!a.state !== !!b.state) {
        return a.state ? -1 : 1
      }

      // If states are equal or both missing, sort alphabetically by state
      if (a.state !== b.state) {
        return (a.state || '').localeCompare(b.state || '')
      }

      // Sort by presence of city (entries with city come first)
      if (!!a.city !== !!b.city) {
        return a.city ? -1 : 1
      }

      // If cities are equal or both missing, sort alphabetically by city
      return (a.city || '').localeCompare(b.city || '')
    })
  }

  getFilteredEntries(
    selectedTypes: number[] = [],
    selectedPlaces: string[] = [],
  ): DiaryEntry[] {
    if (selectedTypes.length === 0 && selectedPlaces.length === 0) {
      return this.entries
    }

    // Create a deep copy of entries to avoid modifying the original
    const entriesCopy: DiaryEntry[] = JSON.parse(JSON.stringify(this.entries))

    // Process each entry
    const filteredEntries = entriesCopy
      .map((entry) => {
        // Process each activity in the entry
        entry.activities = entry.activities.filter((activity) => {
          // Check if place matches filter
          const placeMatches = this.matchesPlace(activity.place, selectedPlaces)

          // If place filter is applied and doesn't match, filter out this activity
          if (selectedPlaces.length > 0 && !placeMatches) {
            return false
          }

          activity.added.forEach((loc) => {
            loc.isSelected =
              selectedTypes.length === 0 ||
              loc.types.some((type) => selectedTypes.includes(type.id))
          })
          activity.edited.forEach((loc) => {
            loc.isSelected =
              selectedTypes.length === 0 ||
              loc.types.some((type) => selectedTypes.includes(type.id))
          })
          activity.visited.forEach((loc) => {
            loc.isSelected =
              selectedTypes.length === 0 ||
              loc.types.some((type) => selectedTypes.includes(type.id))
          })

          // If type filter is applied, check if any location has matching types
          if (selectedTypes.length > 0) {
            return (
              activity.added.some((loc) =>
                loc.types.some((type) => selectedTypes.includes(type.id)),
              ) ||
              activity.edited.some((loc) =>
                loc.types.some((type) => selectedTypes.includes(type.id)),
              ) ||
              activity.visited.some((loc) =>
                loc.types.some((type) => selectedTypes.includes(type.id)),
              )
            )
          }

          return true
        })

        return entry
      })
      .filter((entry) => entry.activities.length > 0)

    return filteredEntries
  }

  // Helper method to check if a place matches the selected places
  private matchesPlace(place: Place, selectedPlaces: string[]): boolean {
    if (selectedPlaces.length === 0) {
      return true
    }

    // Handle coordinate-only places
    if (!place.city && place.coordinatesGrid) {
      return selectedPlaces.includes(place.coordinatesGrid)
    }

    const fullLocationName = [place.city, place.state, place.country]
      .filter(Boolean)
      .join(', ')

    return selectedPlaces.includes(fullLocationName)
  }
}
