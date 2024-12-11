import { components } from './apiSchema'
import { TypesAccess } from './localizedTypes'

interface LocationTypes {
  locationId: number
  typeIds: number[]
  types: Array<{ commonName?: string; scientificName?: string }>
  coordinates: {
    latitude: number
    longitude: number
  }
}

interface ActivityGroup {
  author: string
  userId: number
  location: {
    city: string
    state: string
    country: string
    coordinatesGrid: string
  }
  date: string
  added: LocationTypes[]
  edited: LocationTypes[]
  visited: LocationTypes[]
}

interface TimePeriodGroup {
  daysAgo: number
  activities: ActivityGroup[]
}

function getDaysAgo(date: Date): number {
  const now = new Date()
  const hoursAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600))
  return Math.floor(hoursAgo / 24)
}

export function transformActivityData(
  changes: components['schemas']['LocationChange'][],
  typesAccess: TypesAccess,
): TimePeriodGroup[] {
  // Group changes by time period
  const changesByDate = changes.reduce(
    (
      groups: Record<string, components['schemas']['LocationChange'][]>,
      change,
    ) => {
      const daysAgo = getDaysAgo(new Date(change.created_at))
      groups[daysAgo] = groups[daysAgo] || []
      groups[daysAgo].push(change)
      return groups
    },
    {},
  )

  // Transform each time period
  return Object.entries(changesByDate).map(([daysAgo, periodChanges]) => {
    // Group changes by unique user+location+date combination
    const groupedActivities = new Map<string, ActivityGroup>()

    periodChanges.forEach((change) => {
      const date = change.created_at.split('T')[0]
      const locationKey = change.city
        ? `${change.city},${change.state},${change.country}`
        : `${change.lat.toFixed(4)},${change.lng.toFixed(4)}`
      const groupKey = `${change.author}-${locationKey}-${date}`

      if (!groupedActivities.has(groupKey)) {
        groupedActivities.set(groupKey, {
          author: change.author,
          userId: change.user_id,
          location: {
            city: change.city,
            state: change.state,
            country: change.country,
            coordinatesGrid: `${change.lat.toFixed(4)},${change.lng.toFixed(4)}`,
          },
          date,
          added: [],
          edited: [],
          visited: [],
        })
      }

      const group = groupedActivities.get(groupKey)!
      const types = change.type_ids.map((typeId) => {
        const type = typesAccess.getType(typeId)
        return {
          commonName: type?.commonName,
          scientificName: type?.scientificName,
        }
      })

      const locationTypes: LocationTypes = {
        locationId: change.location_id,
        typeIds: change.type_ids,
        types,
        coordinates: {
          latitude: change.lat,
          longitude: change.lng,
        },
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

      // Filter out edited locations that were also added and deduplicate edits
      const uniqueEdits = new Map<number, LocationTypes>()
      group.edited
        .filter((l) => !addedIds.has(l.locationId))
        .forEach((edit) => uniqueEdits.set(edit.locationId, edit))
      group.edited = Array.from(uniqueEdits.values())
    })

    return {
      daysAgo: parseInt(daysAgo),
      activities: Array.from(groupedActivities.values()),
    }
  })
}
