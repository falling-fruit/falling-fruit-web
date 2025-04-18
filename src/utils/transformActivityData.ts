import { formatISOString } from '../components/entry/textFormatters'
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

export function transformActivityData(
  changes: components['schemas']['LocationChange'][],
  typesAccess: TypesAccess,
  t: Function,
  language: string,
): TimePeriodGroup[] {
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
            location: {
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
        date: periodDate,
        formattedDate,
        activities: Array.from(groupedActivities.values()),
      }
    },
  )
}
