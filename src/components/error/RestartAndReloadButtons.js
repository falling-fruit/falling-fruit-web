import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import Button from '../ui/Button'

const Buttons = styled.div`
  margin-block-start: 2rem;
  text-align: center;

  button {
    width: 110px;

    &:not(:last-child) {
      margin-inline-end: 12px;
    }
  }
`
const ReloadButton = ({ fromPage }) => {
  const { t } = useTranslation()

  return (
    <Buttons>
      <Button secondary onClick={() => (window.location.href = '/')}>
        {t('form.button.restart')}
      </Button>
      <Button onClick={() => (window.location.href = fromPage)}>
        {t('form.button.reload')}
      </Button>
    </Buttons>
  )
}

export default ReloadButton
