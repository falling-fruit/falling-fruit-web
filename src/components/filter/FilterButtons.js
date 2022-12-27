import styled from 'styled-components/macro'

import Button from '../ui/Button'

const FilterButtonsContainer = styled.div`
  button {
    height: 22px;
    width: 90px;
    padding: 0;
    color: ${({ theme }) => theme.tertiaryText};
    border: 2px solid ${({ theme }) => theme.tertiaryText};
    margin-left: 7px;

    &:hover {
      background-color: ${({ theme }) => theme.tertiaryText};
      border-color: ${({ theme }) => theme.tertiaryText};
    }
  }
`

const FilterButtons = ({ onSelectAllClick, onDeselectAllClick }) => (
  <FilterButtonsContainer>
    <Button secondary onClick={onSelectAllClick}>
      Select all
    </Button>
    <Button secondary onClick={onDeselectAllClick}>
      Deselect all
    </Button>
  </FilterButtonsContainer>
)

export default FilterButtons
