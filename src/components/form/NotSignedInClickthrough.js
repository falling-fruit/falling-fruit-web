import '@reach/dialog/styles.css'

import { Dialog } from '@reach/dialog'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import persistentStore from '../../utils/persistentStore'
import { useIsEmbed } from '../../utils/useBreakpoint'
import AuthLinks from '../auth/AuthLinks'
import Button from '../ui/Button'

const StyledDialog = styled(Dialog)`
  border-radius: 0.375em;
  padding: 23px 17px;
  width: 80%;
  max-width: 800px;
  margin: 8vh auto;

  h3 {
    margin-block-start: 0;
  }
`

const Content = styled.div`
  margin-block-start: 1.5em;
  margin-block-end: 1.5em;
`

const CheckboxWrapper = styled.div`
  margin-block-start: 1.5em;
  margin-block-end: 1.5em;
  display: flex;
  align-items: center;
  gap: 8px;

  input[type='checkbox'] {
    cursor: pointer;
  }

  label {
    cursor: pointer;
    user-select: none;
  }
`

const LinksWrapper = styled.div`
  margin-block-start: 1.5em;
  margin-block-end: 1.5em;
  a {
    color: ${({ theme }) => theme.orange};
  }
`

const Buttons = styled.div`
  margin-block-start: 20px;
  text-align: end;

  button {
    width: auto;
    min-width: 110px;
    max-width: 50%;
    padding-inline: 16px;
  }
`

const NotSignedInClickthrough = ({ formType }) => {
  const { t } = useTranslation()
  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const isEmbed = useIsEmbed()
  const [doNotAskAgain, setDoNotAskAgain] = useState(() =>
    persistentStore.getSkipNotSignedInClickthrough(),
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const skipClickthrough = persistentStore.getSkipNotSignedInClickthrough()
    if (!skipClickthrough) {
      setIsOpen(true)
    }
  }, [])

  const title = {
    add_location: t('form.not_signed_in.title.add_location'),
    edit_location: t('form.not_signed_in.title.edit_location'),
    add_review: t('form.not_signed_in.title.add_review'),
  }[formType]

  const handleDismiss = () => {
    setIsOpen(false)
  }

  const handleContinue = () => {
    setIsOpen(false)
  }

  const handleDoNotAskAgainChange = (e) => {
    const checked = e.target.checked
    setDoNotAskAgain(checked)
    persistentStore.setSkipNotSignedInClickthrough(checked)
  }

  if (isLoggedIn || isEmbed || !isOpen) {
    return null
  }

  return (
    <StyledDialog aria-label={title} onDismiss={handleDismiss}>
      <h3>{title}</h3>
      <Content>{t('form.not_signed_in.message')}</Content>
      <LinksWrapper>
        <AuthLinks include={['signIn', 'signUp']} />
      </LinksWrapper>
      <CheckboxWrapper>
        <input
          type="checkbox"
          id="do-not-ask-again"
          checked={doNotAskAgain}
          onChange={handleDoNotAskAgainChange}
        />
        <label htmlFor="do-not-ask-again">
          {t('form.not_signed_in.do_not_ask_again')}
        </label>
      </CheckboxWrapper>
      <Buttons>
        <Button type="button" onClick={handleContinue}>
          {t('form.not_signed_in.continue')}
        </Button>
      </Buttons>
    </StyledDialog>
  )
}

export default NotSignedInClickthrough
