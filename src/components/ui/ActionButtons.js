import { Pencil, Trash } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import ResetButton from './ResetButton'
import ReturnIcon from './ReturnIcon'

const StyledButton = styled(ResetButton)`
  display: flex;
  align-items: center;
  ${({ theme, $regular }) =>
    !$regular &&
    `
    color: ${theme.secondaryText};
    font-size: 0.9375rem;
    font-weight: bold;
  `}

  svg {
    width: 1.2em;
    height: 1.2em;
    margin-inline-end: 0.25em;
  }
`

const BackButton = ({ backPath, ...props }) => {
  const { t } = useTranslation()
  const history = useAppHistory()

  const handleBack = (event) => {
    event.stopPropagation()
    if (backPath) {
      history.push(backPath)
    } else {
      history.goBack()
    }
  }

  return (
    <StyledButton onClick={handleBack} {...props}>
      <ReturnIcon />
      {t('layouts.back')}
    </StyledButton>
  )
}

const EditButton = ({ onClick, regular, ...props }) => {
  const { t } = useTranslation()

  return (
    <StyledButton onClick={onClick} $regular={regular} {...props}>
      <Pencil />
      {t('form.button.edit')}
    </StyledButton>
  )
}

const DeleteButton = ({ onClick, regular, ...props }) => {
  const { t } = useTranslation()

  return (
    <StyledButton onClick={onClick} $regular={regular} {...props}>
      <Trash />
      {t('form.button.delete')}
    </StyledButton>
  )
}

export { BackButton, DeleteButton, EditButton }
