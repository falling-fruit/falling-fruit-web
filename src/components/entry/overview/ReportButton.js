import { Flag } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { ReportModal } from '../../form/ReportModal'
import Button from '../../ui/Button'
import useLocationPane from '../useLocationPane'

export const ReportButton = () => {
  const { location: locationData } = useSelector((state) => state.location)
  const { t } = useTranslation()
  const typesAccess = useSelector((state) => state.type.typesAccess)
  const location = useLocation()
  const { reportModalOpen, openReportModal, closeReportModal } =
    useLocationPane()

  const defaultProblemCode = location.state?.problem_code ?? null
  const defaultComment = location.state?.comment ?? null

  const locationName = locationData?.type_ids
    .map((id) => typesAccess?.getType(id)?.commonName)
    .filter(Boolean)
    .join(', ')

  return (
    <>
      {reportModalOpen && (
        <ReportModal
          locationId={locationData.id}
          title={`${t('form.button.report')} ${locationName}`}
          name={locationName}
          onDismiss={closeReportModal}
          defaultProblemCode={defaultProblemCode}
          defaultComment={defaultComment}
        />
      )}
      <Button leftIcon={<Flag />} secondary onClick={() => openReportModal({})}>
        {t('form.button.report')}
      </Button>
    </>
  )
}
