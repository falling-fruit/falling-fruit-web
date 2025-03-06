import { Flag } from '@styled-icons/boxicons-solid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { ReportModal } from '../../form/ReportModal'
import Button from '../../ui/Button'

export const ReportButton = () => {
  const { location: locationData } = useSelector((state) => state.location)
  const { t } = useTranslation()
  const typesAccess = useSelector((state) => state.type.typesAccess)

  const locationName = locationData?.type_ids
    .map((id) => typesAccess?.getType(id)?.commonName)
    .filter(Boolean)
    .join(', ')
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  return (
    <>
      {isReportModalOpen && (
        <ReportModal
          locationId={locationData.id}
          title={`${t('form.button.report')} ${locationName}`}
          name={locationName}
          onDismiss={() => setIsReportModalOpen(false)}
        />
      )}
      <Button
        leftIcon={<Flag />}
        secondary
        onClick={() => setIsReportModalOpen(true)}
      >
        {t('form.button.report')}
      </Button>
    </>
  )
}
