import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import Button from '../ui/Button'

const FilterButtonsContainer = styled.div`
  display: inline-block;
  button {
    height: 22px;
    padding: 2px 4px;
    color: ${({ theme }) => theme.tertiaryText};
    border: 2px solid ${({ theme }) => theme.tertiaryText};
    &:not(:last-child) {
      margin-right: 5px;
    }

    &:hover {
      background-color: ${({ theme }) => theme.tertiaryText};
      border-color: ${({ theme }) => theme.tertiaryText};
    }
  }
`

const FilterButtons = ({ onSelectAllClick, onDeselectAllClick }) => {
  const { t } = useTranslation()
  return (
    <FilterButtonsContainer>
      <Button secondary onClick={onSelectAllClick}>
        {t('filter.select_all')}
      </Button>
      <Button secondary onClick={onDeselectAllClick}>
        {t('filter.deselect_all')}
      </Button>
    </FilterButtonsContainer>
  )
}

export default FilterButtons
