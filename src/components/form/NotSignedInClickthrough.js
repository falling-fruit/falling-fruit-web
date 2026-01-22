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
  const [doNotAskAgain, setDoNotAskAgain] = useState(
    () => localStorage.getItem('skipNotSignedInClickthrough') === 'true',
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const skipClickthrough = localStorage.getItem('skipNotSignedInClickthrough')
    if (skipClickthrough !== 'true') {
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
    if (checked) {
      localStorage.setItem('skipNotSignedInClickthrough', 'true')
    } else {
      localStorage.removeItem('skipNotSignedInClickthrough')
    }
  }

  if (!isOpen) {
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
