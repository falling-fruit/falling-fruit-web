import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../ui/Button'
import DonationModal from './DonationModal'

const DonationButton = () => {
  const { t } = useTranslation()
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)

  return (
    <>
      <DonationModal
        isOpen={isDonationModalOpen}
        onDismiss={() => setIsDonationModalOpen(false)}
      />
      <Button onClick={() => setIsDonationModalOpen(true)}>
        {t('pages.about.give_zeffy')}
      </Button>
    </>
  )
}

export default DonationButton
