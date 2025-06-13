import { Copy as CopyIcon } from '@styled-icons/boxicons-regular'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { closeShare } from '../../redux/shareSlice'
import Button from '../ui/Button'
import CloseButton from '../ui/CloseButton'
import Input from '../ui/Input'
import useShareUrl from './useShareUrl'

const ShareContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

const ShareTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.secondaryText};
  margin-inline-end: 20px;
`

const ShareUrlContainer = styled.div`
  display: flex;
  align-items: center;
  margin-block-end: 0.75rem;
`

const EmbedToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-block-end: 0.5rem;
`

const ToggleLabel = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.secondaryText};
  margin-inline-start: 0.5rem;
  cursor: pointer;
`

const ToggleSwitch = styled.input`
  cursor: pointer;
`

const ShareInput = styled(Input)`
  flex: 1;
  padding: 0 0.5rem;
  margin-inline-end: 0.5rem;
  vertical-align: middle;
  min-height: 2.7rem;
`

const CopyButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  align-self: center;

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`

const Share = ({ onClose }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [embedMode, setEmbedMode] = useState(false)
  const [displayUrl, setDisplayUrl] = useState('')
  const currentUrl = useShareUrl(embedMode)
  const displayUrlIsInitialValue = displayUrl === ''
  const displayUrlIsUpToDate = displayUrl === currentUrl

  // If changing after 'simplified_controls_only' checkbox interaction, animate for feedback
  useEffect(() => {
    if (displayUrlIsInitialValue) {
      setDisplayUrl(currentUrl)
    } else if (!displayUrlIsUpToDate) {
      setDisplayUrl('...')
      const timer = setTimeout(() => {
        setDisplayUrl(currentUrl)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [displayUrlIsInitialValue, displayUrlIsUpToDate, currentUrl])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      toast.success(t('share.url_copied'))
      if (onClose) {
        onClose()
      } else {
        dispatch(closeShare())
      }
    } catch (err) {
      console.error(err)
      toast.error(t('share.url_copy_failed'))
    }
  }

  return (
    <ShareContainer>
      <ShareTitle>{t('share.title')}</ShareTitle>
      {onClose && <CloseButton onClick={onClose} />}
      <EmbedToggleContainer>
        <ToggleSwitch
          type="checkbox"
          id="embed-toggle"
          checked={embedMode}
          onChange={() => setEmbedMode(!embedMode)}
        />
        <ToggleLabel htmlFor="embed-toggle">
          {t('share.simplified_controls_only')}
        </ToggleLabel>
      </EmbedToggleContainer>
      <ShareUrlContainer>
        <ShareInput
          type="text"
          value={displayUrl}
          readOnly
          onClick={(e) => e.target.select()}
          height="30px"
          dir="ltr"
        />
        <CopyButton onClick={handleCopy}>
          <CopyIcon />
        </CopyButton>
      </ShareUrlContainer>
    </ShareContainer>
  )
}

export default Share
