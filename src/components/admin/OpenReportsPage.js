import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { selectIsAdmin, selectIsAuthLoading } from '../../utils/isAdmin'
import { PageHeader } from '../ui/Headers'
import { InfoPage } from '../ui/PageTemplate'
import OpenReportsTable from './OpenReportsTable'
import { reportStrings } from './reportStrings'

const OpenReportsPage = () => {
  const isAdmin = useSelector(selectIsAdmin)
  const isAuthLoading = useSelector(selectIsAuthLoading)

  if (!isAdmin && !isAuthLoading) {
    return <Redirect to="/map" />
  }

  return (
    <InfoPage fullWidth>
      <PageHeader>{reportStrings.reports.openTitle}</PageHeader>
      <OpenReportsTable />
    </InfoPage>
  )
}

export default OpenReportsPage
