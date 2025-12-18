import '@reach/dialog/styles.css'

import { Dialog } from '@reach/dialog'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

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
  text-align: justify;
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

const NotSignedInClickthrough = ({ flavour }) => {
  const { t } = useTranslation()
  const [doNotAskAgain, setDoNotAskAgain] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const skipClickthrough = localStorage.getItem('skipNotSignedInClickthrough')
    if (skipClickthrough !== 'true') {
      setIsOpen(true)
    }
  }, [])

  const title = {
    add: t('form.not_signed_in.add.title'),
    edit: t('form.not_signed_in.edit.title'),
    review: t('form.not_signed_in.review.title'),
  }[flavour]
  const message = {
    add: t('form.not_signed_in.add.message'),
    edit: t('form.not_signed_in.edit.message'),
    review: t('form.not_signed_in.review.message'),
  }[flavour]

  const handleDismiss = () => {
    setIsOpen(false)
  }

  const handleContinue = () => {
    if (doNotAskAgain) {
      localStorage.setItem('skipNotSignedInClickthrough', 'true')
    }
    setIsOpen(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <StyledDialog aria-label={title} onDismiss={handleDismiss}>
      <h3>{title}</h3>
      <Content>{message}</Content>
      <Content>{t('form.not_signed_in.why_account')}</Content>
      <LinksWrapper>
        <AuthLinks include={['signIn', 'signUp']} />
      </LinksWrapper>
      <CheckboxWrapper>
        <input
          type="checkbox"
          id="do-not-ask-again"
          checked={doNotAskAgain}
          onChange={(e) => setDoNotAskAgain(e.target.checked)}
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
