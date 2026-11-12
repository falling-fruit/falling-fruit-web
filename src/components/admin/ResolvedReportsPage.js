import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { selectIsAdmin, selectIsAuthLoading } from '../../utils/isAdmin'
import { PageHeader } from '../ui/Headers'
import { InfoPage } from '../ui/PageTemplate'
import { adminStrings } from './adminStrings'
import ResolvedReportsTable from './ResolvedReportsTable'

const ResolvedReportsPage = () => {
  const isAdmin = useSelector(selectIsAdmin)
  const isAuthLoading = useSelector(selectIsAuthLoading)

  if (!isAdmin && !isAuthLoading) {
    return <Redirect to="/map" />
  }

  return (
    <InfoPage fullWidth>
      <PageHeader>{adminStrings.reports.resolvedTitle}</PageHeader>
      <ResolvedReportsTable />
    </InfoPage>
  )
}

export default ResolvedReportsPage
