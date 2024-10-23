import React from 'react'

import {
  ActivityText,
  AuthorName,
  List,
  ListItem,
  PlantLink,
} from './styles/ActivityPageStyles'

const InfinityList = ({ groupedChanges, timePeriods, getPlantName }) => {
  const renderGroup = (groupName, changes) => {
    if (changes.length === 0) {
      return null
    }

    return (
      <div key={groupName}>
        <h3>{groupName.replace(/[A-Z]/g, (letter) => `${letter}`).trim()}</h3>
        <List>
          {changes.map((change, index) => (
            <ListItem key={index}>
              {change.type_ids.map((typeId, idx) => (
                <p key={`${index}${idx}`}>
                  <PlantLink
                    href={`/locations/${change.lat},${change.lng},15z`}
                  >
                    {getPlantName(typeId)}
                  </PlantLink>
                  <ActivityText>
                    , {change.description} in {change.city}, {change.state},{' '}
                    {change.country} —{' '}
                  </ActivityText>
                  <AuthorName>{change.author}</AuthorName>
                </p>
              ))}
            </ListItem>
          ))}
        </List>
      </div>
    )
  }

  return (
    <>
      {timePeriods.map((period) =>
        renderGroup(period.name, groupedChanges[period.name]),
      )}
    </>
  )
}

export default InfinityList
