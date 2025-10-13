import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import DonationModal from './DonationModal'

const PointerButton = styled.button`
  cursor: pointer;
`

const DonationButton = () => {
  const { t } = useTranslation()
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)

  return (
    <>
      <DonationModal
        isOpen={isDonationModalOpen}
        onDismiss={() => setIsDonationModalOpen(false)}
      />
      <PointerButton onClick={() => setIsDonationModalOpen(true)}>
        {t('pages.about.give_zeffy')}
      </PointerButton>
    </>
  )
}

export default DonationButton
