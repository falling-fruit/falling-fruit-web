import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import Button from '../ui/Button'

const FilterButtonsContainer = styled.div`
  margin-block: 0.5em;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.25em;

  button {
    height: 1.75em;
    margin-block: 0.5em;
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
        {t('filter.clear')}
      </Button>
    </FilterButtonsContainer>
  )
}

export default FilterButtons
