import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import Button from '../ui/Button'

const FilterButtonsContainer = styled.div`
  width: 100%;

  button {
    width: 100%;
    height: 2.5em;
    margin-block-end: 0.5em;
    color: ${({ theme }) => theme.tertiaryText};
    border: 2px solid ${({ theme }) => theme.tertiaryText};

    &:not(:disabled):hover {
      background-color: ${({ theme }) => theme.tertiaryText};
      border-color: ${({ theme }) => theme.tertiaryText};
    }
  }
`

const FilterButtons = ({
  onSelectAllClick,
  onDeselectAllClick,
  isSelectAllDisabled,
  isDeselectAllDisabled,
}) => {
  const { t } = useTranslation()
  return (
    <FilterButtonsContainer>
      <Button
        secondary
        onClick={onSelectAllClick}
        disabled={isSelectAllDisabled}
      >
        {t('filter.select_shown')}
      </Button>
      <Button
        secondary
        onClick={onDeselectAllClick}
        disabled={isDeselectAllDisabled}
      >
        {t('filter.deselect_shown')}
      </Button>
    </FilterButtonsContainer>
  )
}

export default FilterButtons
