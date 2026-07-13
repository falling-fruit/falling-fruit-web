import { Flag } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { useAppHistory } from '../../../utils/useAppHistory'
import { ReportModal } from '../../form/ReportModal'
import Button from '../../ui/Button'

export const ReportButton = () => {
  const { location: locationData } = useSelector((state) => state.location)
  const { t } = useTranslation()
  const typesAccess = useSelector((state) => state.type.typesAccess)
  const history = useAppHistory()
  const location = useLocation()

  const isReportModalOpen =
    new URLSearchParams(location.search).get('report') === 'true'

  const defaultProblemCode = location.state?.problem_code ?? null
  const defaultComment = location.state?.comment ?? null

  const locationName = locationData?.type_ids
    .map((id) => typesAccess?.getType(id)?.commonName)
    .filter(Boolean)
    .join(', ')

  const handleReportClick = () => {
    history.addParam('report', 'true')
  }

  const handleDismiss = () => {
    history.removeParam('report')
  }

  return (
    <>
      {isReportModalOpen && (
        <ReportModal
          locationId={locationData.id}
          title={`${t('form.button.report')} ${locationName}`}
          name={locationName}
          onDismiss={handleDismiss}
          defaultProblemCode={defaultProblemCode}
          defaultComment={defaultComment}
        />
      )}
      <Button leftIcon={<Flag />} secondary onClick={handleReportClick}>
        {t('form.button.report')}
      </Button>
    </>
  )
}
