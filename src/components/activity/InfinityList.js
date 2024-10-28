import React from 'react'

import {
  ActivityText,
  AuthorName,
  List,
  ListItem,
  PlantLink,
} from './styles/ActivityPageStyles'

const InfinityList = ({ groupedChanges, getPlantName }) => {
  const renderGroup = (groupName, changes) => {
    if (changes.length === 0) {
      return null
    }

    const groupedByUserAndLocation = changes.reduce((acc, change) => {
      const groupKey = `${change.author}-${change.city}-${change.state}-${
        change.country
      }-${change.created_at.split('T')[0]}`

      if (!acc[groupKey]) {
        acc[groupKey] = []
      }

      acc[groupKey].push(change)
      return acc
    }, {})

    const countAndLimitTypes = (changes) => {
      const typeCounts = {}

      changes.forEach((change) => {
        change.type_ids.forEach((typeId) => {
          const plantName = getPlantName(typeId)
          if (typeCounts[plantName]) {
            typeCounts[plantName] += 1
          } else {
            typeCounts[plantName] = 1
          }
        })
      })

      const plantEntries = Object.entries(typeCounts).map(([name, count]) =>
        count > 1 ? `${name} x${count}` : name,
      )

      if (plantEntries.length > 7) {
        return `${plantEntries.slice(0, 7).join(', ')}, ...`
      }

      return plantEntries.join(', ')
    }

    return (
      <div key={groupName}>
        <h3>{groupName}</h3>
        <List>
          {Object.entries(groupedByUserAndLocation).map(
            ([_, userChanges], index) => {
              const { author, city, state, country } = userChanges[0]

              const typesAdded = countAndLimitTypes(
                userChanges.filter((change) => change.description === 'added'),
              )

              const typesEdited = countAndLimitTypes(
                userChanges.filter((change) => change.description === 'edited'),
              )

              return (
                <ListItem key={index}>
                  {typesAdded && (
                    <p>
                      <PlantLink
                        href={`/locations/${userChanges[0].location_id}`}
                      >
                        {typesAdded}
                      </PlantLink>
                      <ActivityText>
                        , added in {city}, {state}, {country} —{' '}
                      </ActivityText>
                      <AuthorName>{author}</AuthorName>
                    </p>
                  )}

                  {typesEdited && (
                    <p>
                      <PlantLink
                        href={`/locations/${userChanges[0].location_id}`}
                      >
                        {typesEdited}
                      </PlantLink>
                      <ActivityText>
                        , edited in {city}, {state}, {country} —{' '}
                      </ActivityText>
                      <AuthorName>{author}</AuthorName>
                    </p>
                  )}
                </ListItem>
              )
            },
          )}
        </List>
      </div>
    )
  }

  return (
    <>
      {Object.entries(groupedChanges).map(([dateString, changes]) =>
        renderGroup(dateString, changes),
      )}
    </>
  )
}

export default InfinityList
