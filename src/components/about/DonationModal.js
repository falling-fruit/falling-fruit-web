import { Dialog } from '@reach/dialog'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import CloseButton from '../ui/CloseButton'
import LoadingIndicator from '../ui/LoadingIndicator'

const StyledDialog = styled(Dialog)`
  border-radius: 0.375em;
  padding: 0;
  width: min(500px, 90vw);
  height: min(600px, 90vh);
  margin: 15vh auto;
  position: relative;
`

const DonateIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0.375em;
  display: block;
`

const DonationModal = ({ isOpen, onDismiss }) => {
  const { t } = useTranslation()
  const [iframeIsLoaded, setIframeIsLoaded] = useState(false)

  const handleIframeLoad = () => {
    setIframeIsLoaded(true)
  }

  const handleDismiss = () => {
    setIframeIsLoaded(false)
    onDismiss()
  }

  if (!isOpen) {
    return null
  }

  return (
    <StyledDialog aria-label="Donation form dialog" onDismiss={handleDismiss}>
      <CloseButton onClick={handleDismiss} />
      {!iframeIsLoaded && <LoadingIndicator vertical cover />}
      <DonateIframe
        src="https://www.zeffy.com/embed/donation-form/falling-fruit"
        title={t('pages.about.donate')}
        onLoad={handleIframeLoad}
        style={{ display: iframeIsLoaded ? 'block' : 'none' }}
      />
    </StyledDialog>
  )
}

export default DonationModal
