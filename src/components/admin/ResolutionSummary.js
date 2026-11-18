import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import LocationDisplay from '../ui/LocationDisplay'
import { problemTypeLabel } from './adminStrings'
import { uniqueLocations } from './resolution'

const Summary = styled.h3`
  margin-block: 0 1em;
  font-size: 1.1rem;
  line-height: 1.4;
`

const Muted = styled.span`
  color: ${({ theme }) => theme.secondaryText};
`

const countLabel = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`

const summarize = (reports) => {
  const problemCodes = [...new Set(reports.map((r) => r.problem_code))]

  return {
    reportCount: reports.length,
    problemCodes,
    locations: uniqueLocations(reports),
  }
}

const LocationPart = ({ locationId, location }) => {
  if (locationId == null) {
    return <Muted>a deleted location</Muted>
  }
  return (
    <Link to={`/locations/${locationId}`}>
      {location ? <LocationDisplay location={location} /> : `#${locationId}`}
    </Link>
  )
}

const ResolutionSummary = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return null
  }

  const { reportCount, problemCodes, locations } = summarize(reports)

  const problemPart =
    problemCodes.length === 1
      ? problemTypeLabel(problemCodes[0])
      : countLabel(reportCount, 'report')

  const singleLocation = locations.length === 1 ? locations[0] : null
  const locationPart = singleLocation ? (
    <LocationPart
      locationId={singleLocation.locationId}
      location={singleLocation.location}
    />
  ) : (
    countLabel(locations.length, 'location')
  )

  const showReportCount = reportCount > 1 && problemCodes.length === 1

  return (
    <Summary>
      Resolve {problemPart} — {locationPart}
      {showReportCount ? (
        <Muted> ({countLabel(reportCount, 'report')})</Muted>
      ) : (
        ''
      )}
    </Summary>
  )
}

export default ResolutionSummary
