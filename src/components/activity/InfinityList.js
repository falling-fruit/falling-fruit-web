import React from 'react'

import {
  ActivityText,
  AuthorName,
  ListChanges,
  ListItem,
  PlantLink,
} from './ActivityPageStyles'

const InfinityList = ({ groupedChanges, getPlantName }) => {
  const renderGroup = (groupName, changes) => {
    if (changes.length === 0) {
      return null
    }

    const filteredChanges = []
    const seenChanges = new Map()

    changes.forEach((change) => {
      const key = `${change.author}-${change.city}-${change.state}-${
        change.country
      }-${change.location_id}-${change.type_ids.join(',')}-${
        change.description
      }`
      const date = change.created_at.split('T')[0]

      if (!seenChanges.has(key)) {
        seenChanges.set(key, date)
        filteredChanges.push(change)
      } else if (seenChanges.get(key) === date) {
        return
      } else {
        seenChanges.set(key, date)
        filteredChanges.push(change)
      }
    })

    const groupedByUserAndLocation = filteredChanges.reduce((acc, change) => {
      const groupKey = `${change.author}-${change.city}-${change.state}-${
        change.country
      }-${change.created_at.split('T')[0]}`

      if (!acc[groupKey]) {
        acc[groupKey] = []
      }

      acc[groupKey].push(change)
      return acc
    }, {})

    const getTypeLinks = (changes) => {
      const typeLinks = []

      changes.forEach((change) => {
        change.type_ids.forEach((typeId) => {
          const plantName = getPlantName(typeId)
          typeLinks.push(
            <PlantLink
              key={`${change.location_id}-${typeId}-${plantName}`}
              href={`/locations/${change.location_id}`}
            >
              {plantName}
            </PlantLink>,
          )
        })
      })

      return typeLinks
    }

    return (
      <div key={groupName}>
        <h3>{groupName}</h3>
        <ListChanges>
          {Object.entries(groupedByUserAndLocation).map(
            ([_, userChanges], index) => {
              const { author, city, state, country } = userChanges[0]

              const addedTypeLinks = getTypeLinks(
                userChanges.filter((change) => change.description === 'added'),
              )

              const editedTypeLinks = getTypeLinks(
                userChanges.filter((change) => change.description === 'edited'),
              )

              return (
                <ListItem key={index}>
                  {addedTypeLinks.length > 0 && (
                    <p>
                      {addedTypeLinks.map((link, idx) => (
                        <React.Fragment key={idx}>
                          {link}
                          {idx < addedTypeLinks.length - 1 && ', '}
                        </React.Fragment>
                      ))}
                      <ActivityText>
                        {' '}
                        added in {city}, {state}, {country}
                        {author && ' — '}
                      </ActivityText>
                      {author && <AuthorName>{author}</AuthorName>}
                    </p>
                  )}

                  {editedTypeLinks.length > 0 && (
                    <p>
                      {editedTypeLinks.map((link, idx) => (
                        <React.Fragment key={idx}>
                          {link}
                          {idx < editedTypeLinks.length - 1 && ', '}
                        </React.Fragment>
                      ))}
                      <ActivityText>
                        {' '}
                        edited in {city}, {state}, {country}
                        {author && ' — '}
                      </ActivityText>
                      {author && <AuthorName>{author}</AuthorName>}
                    </p>
                  )}
                </ListItem>
              )
            },
          )}
        </ListChanges>
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
